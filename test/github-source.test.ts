import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { GithubSource } from "../agent/sources/github";

const fx = (name: string) =>
  JSON.parse(readFileSync(`test/fixtures/github/${name}.json`, "utf8"));

/** URL-substring → fixture body. First match wins. */
function fakeFetch(routes: Array<[string, unknown]>): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = String(input);
    const hit = routes.find(([needle]) => url.includes(needle));
    if (!hit) throw new Error(`no fixture for ${url}`);
    return new Response(JSON.stringify(hit[1]), { status: 200 });
  }) as typeof fetch;
}

const window = {
  since: new Date("2026-07-14T08:00:00Z"),
  until: new Date("2026-07-17T08:00:00Z"),
};

const routes: Array<[string, unknown]> = [
  ["/user", fx("user")],
  ["review%3Achanges_requested", fx("search_backstop")],
  ["/search/issues", fx("search_windowed")],
  ["/repos/jamestexas/agents/pulls/42/reviews", fx("reviews")],
  ["/repos/jamestexas/agents/issues/42/comments", fx("comments")],
  ["/repos/jamestexas/mache/pulls/7/reviews", fx("reviews")],
  ["/repos/jamestexas/mache/issues/7/comments", []],
];

describe("GithubSource", () => {
  it("is registered under the name 'github'", () => {
    expect(new GithubSource("t", fakeFetch(routes)).name).toBe("github");
  });

  it("fetch returns one composite record per PR, windowed + backstop merged", async () => {
    const source = new GithubSource("t", fakeFetch(routes));
    const raws = (await source.fetch(window)) as Array<{ pr: { number: number }; backstop: boolean }>;
    expect(raws).toHaveLength(2);
    const windowed = raws.find((r) => r.pr.number === 42)!;
    const backstop = raws.find((r) => r.pr.number === 7)!;
    expect(windowed.backstop).toBe(false);
    expect(backstop.backstop).toBe(true);
  });

  it("maps verdicts hard, marks own comments as own_reply, canonical URI", async () => {
    const source = new GithubSource("t", fakeFetch(routes));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 42)!;
    const event = source.mapToLifecycleEvent(rec);
    expect(event.artifact.uri).toBe("pr:jamestexas/agents#42");
    const verdict = event.observations.find((o) => o.type === "review_changes_requested")!;
    expect(verdict.classification).toBe("hard");
    expect(verdict.author).toBe("mark");
    const own = event.observations.find((o) => o.author === "jamestexas")!;
    expect(own.type).toBe("own_reply");
  });

  it("backstop records carry a needs_you state_hint", async () => {
    const source = new GithubSource("t", fakeFetch(routes));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 7)!;
    expect(source.mapToLifecycleEvent(rec).state_hint).toBe("needs_you");
  });

  it("honors retry-after once, then surfaces rate limiting as an error", async () => {
    let calls = 0;
    const limited = (async () => {
      calls++;
      if (calls === 1) {
        return new Response("{}", { status: 429, headers: { "retry-after": "0" } });
      }
      return new Response(JSON.stringify(fx("user")), { status: 200 });
    }) as typeof fetch;
    const recovered = new GithubSource("t", limited);
    await expect(recovered.freshness()).resolves.toBeTruthy();

    const alwaysLimited = (async () =>
      new Response("{}", { status: 429, headers: { "retry-after": "999" } })) as typeof fetch;
    const dead = new GithubSource("t", alwaysLimited);
    await expect(dead.fetch(window)).rejects.toThrow(/rate limited/);
  });

  it("fails loudly on malformed records", () => {
    const source = new GithubSource("t", fakeFetch(routes));
    expect(() => source.mapToLifecycleEvent({ nope: true })).toThrow();
  });

  it("skips PENDING reviews (submitted_at: null) rather than emitting an invalid observation", () => {
    const source = new GithubSource("t", fakeFetch(routes));
    const rec = {
      pr: {
        number: 42,
        title: "feat: add pr-board skill",
        html_url: "https://github.com/jamestexas/agents/pull/42",
        repository: "jamestexas/agents",
        state: "open",
        merged_at: null,
        closed_at: null,
      },
      reviews: fx("reviews_pending"),
      comments: [],
      backstop: false,
      viewer: "jamestexas",
    };
    const event = source.mapToLifecycleEvent(rec);
    // Only the submitted CHANGES_REQUESTED review produces an observation;
    // the PENDING review (submitted_at: null) is skipped entirely.
    expect(event.observations).toHaveLength(1);
    const verdict = event.observations[0];
    expect(verdict.type).toBe("review_changes_requested");
    expect(verdict.at).toBe("2026-07-16T14:00:00Z");
  });
});
