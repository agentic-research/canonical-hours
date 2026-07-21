import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { GithubSource } from "../agent/sources/github";

const fx = (name: string) => JSON.parse(readFileSync(`test/fixtures/github/${name}.json`, "utf8"));

/**
 * Fake GraphQL POST endpoint. GitHub's GraphQL API is one POST endpoint
 * with a body, not distinguishable by URL — routes match on a substring
 * the query TEXT contains (the search query-string argument, which is
 * unique per call), returning the fixture body as the whole GraphQL
 * response ({ data: {...} }). Last match wins, so callers can append a
 * more specific override after a shared `routes` spread to shadow it.
 */
function fakeFetch(routes: Array<[string, unknown]>): typeof fetch {
  return (async (_url: RequestInfo | URL, init?: RequestInit) => {
    const body = String(init?.body ?? "");
    const hit = routes.slice().reverse().find(([needle]) => body.includes(needle));
    if (!hit) throw new Error(`no fixture for request body: ${body.slice(0, 200)}`);
    return new Response(JSON.stringify(hit[1]), { status: 200 });
  }) as typeof fetch;
}

const window = {
  since: new Date("2026-07-14T08:00:00Z"),
  until: new Date("2026-07-17T08:00:00Z"),
};

// search_windowed's PR #42 always carries two failing checks (Task 4 fixture),
// so every test that fetches through the shared routes needs the conditional
// isRequired resolution satisfied by default; per-test overrides shadow it
// (see fakeFetch's last-match-wins behavior above).
const routes: Array<[string, unknown]> = [
  ["review:changes_requested", fx("search_backstop")],
  ["updated:>=", fx("search_windowed")],
  ["pr42:", fx("required_check_isrequired")],
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
  });

  it("backstop records carry a needs_you state_hint", async () => {
    const source = new GithubSource("t", fakeFetch(routes));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 7)!;
    expect(source.mapToLifecycleEvent(rec).state_hint).toBe("needs_you");
  });

  it("fails loudly on malformed records", () => {
    const source = new GithubSource("t", fakeFetch(routes));
    expect(() => source.mapToLifecycleEvent({ nope: true })).toThrow();
  });

  it("null statusCheckRollup (no commits/checks yet) maps to an empty checkRollup", async () => {
    const source = new GithubSource("t", fakeFetch(routes));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number }; checkRollup: unknown[] }>).find((r) => r.pr.number === 7)!;
    expect(rec.checkRollup).toEqual([]);
  });

  it("sleeps until rateLimit.resetAt when remaining drops below min_remaining, then continues", async () => {
    const sleeps: number[] = [];
    const fakeSleep = async (ms: number) => { sleeps.push(ms); };
    const now = () => new Date("2026-07-21T12:00:00Z");
    const lowLimitThenNormal: Array<[string, unknown]> = [
      ["updated:>=", {
        data: {
          rateLimit: { remaining: 50, resetAt: "2026-07-21T12:05:00Z" }, // below min_remaining=200
          viewer: { login: "jamestexas" },
          search: { nodes: [] },
        },
      }],
      ["review:changes_requested", fx("search_backstop")],
    ];
    const source = new GithubSource("t", fakeFetch(lowLimitThenNormal), now, 200, fakeSleep);
    await source.fetch(window);
    expect(sleeps).toHaveLength(1);
    // resetAt (12:05:00) - now (12:00:00) = 5 minutes = 300_000ms
    expect(sleeps[0]).toBe(300_000);
  });

  it("does not sleep when remaining stays above min_remaining", async () => {
    const sleeps: number[] = [];
    const fakeSleep = async (ms: number) => { sleeps.push(ms); };
    const source = new GithubSource("t", fakeFetch(routes), () => new Date(), 200, fakeSleep);
    await source.fetch(window);
    expect(sleeps).toHaveLength(0);
  });

  it("a failing REQUIRED check sets needs_you and emits a check_failed observation", async () => {
    const source = new GithubSource("t", fakeFetch([...routes, ["pr42:", fx("required_check_isrequired")]]));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 42)!;
    const event = source.mapToLifecycleEvent(rec);
    expect(event.state_hint).toBe("needs_you");
    const checkObs = event.observations.find((o) => o.type === "check_failed")!;
    expect(checkObs).toBeDefined();
    expect(checkObs.classification).toBe("hard");
    expect(checkObs.payload.name).toBe("ci-required");
    // The non-required failing check must NOT produce its own check_failed observation.
    expect(event.observations.filter((o) => o.type === "check_failed")).toHaveLength(1);
  });

  it("a failing NON-required check alone does not set needs_you", async () => {
    // Same fixture, but the conditional isRequired response says both are non-required.
    const bothOptional = {
      data: {
        rateLimit: { remaining: 4989, resetAt: "2026-07-21T12:00:00Z" },
        pr42: {
          commits: { nodes: [ { commit: { statusCheckRollup: { contexts: { nodes: [
            { __typename: "CheckRun", name: "ci-required", conclusion: "FAILURE", isRequired: false },
            { __typename: "CheckRun", name: "ci-optional", conclusion: "FAILURE", isRequired: false },
          ] } } } } ] },
        },
      },
    };
    const source = new GithubSource("t", fakeFetch([...routes, ["pr42:", bothOptional]]));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 42)!;
    const event = source.mapToLifecycleEvent(rec);
    expect(event.state_hint).toBeUndefined();
    expect(event.observations.filter((o) => o.type === "check_failed")).toHaveLength(0);
  });

  it("no failing checks anywhere → the conditional isRequired request is never issued", async () => {
    let conditionalCalled = false;
    // search_windowed's PR #42 always has failing checks (Task 4 fixture), so this
    // test can't reuse the shared `routes` — it needs a windowed result with no PRs
    // to genuinely have zero failing checks anywhere. search_backstop.json's PR #7
    // (null statusCheckRollup) supplies the other half of the "no failures" premise.
    const noFailuresRoutes: Array<[string, unknown]> = [
      ["review:changes_requested", fx("search_backstop")],
      ["updated:>=", { data: { rateLimit: { remaining: 4999, resetAt: "2026-07-21T12:00:00Z" }, viewer: { login: "jamestexas" }, search: { nodes: [] } } }],
    ];
    const trackingFetch: typeof fetch = (async (url, init) => {
      const body = String(init?.body ?? "");
      if (body.includes("pr42:") || body.includes("pr7:")) conditionalCalled = true;
      return fakeFetch(noFailuresRoutes)(url, init);
    }) as typeof fetch;
    const source = new GithubSource("t", trackingFetch);
    await source.fetch(window);
    expect(conditionalCalled).toBe(false);
  });
});
