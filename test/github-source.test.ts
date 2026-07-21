import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { GithubSource } from "../agent/sources/github";

const fx = (name: string) => JSON.parse(readFileSync(`test/fixtures/github/${name}.json`, "utf8"));

/**
 * Fake GraphQL POST endpoint. GitHub's GraphQL API is one POST endpoint
 * with a body, not distinguishable by URL — routes match on a substring
 * the query TEXT contains (the search query-string argument, which is
 * unique per call), returning the fixture body as the whole GraphQL
 * response ({ data: {...} }).
 */
function fakeFetch(routes: Array<[string, unknown]>): typeof fetch {
  return (async (_url: RequestInfo | URL, init?: RequestInit) => {
    const body = String(init?.body ?? "");
    const hit = routes.find(([needle]) => body.includes(needle));
    if (!hit) throw new Error(`no fixture for request body: ${body.slice(0, 200)}`);
    return new Response(JSON.stringify(hit[1]), { status: 200 });
  }) as typeof fetch;
}

const window = {
  since: new Date("2026-07-14T08:00:00Z"),
  until: new Date("2026-07-17T08:00:00Z"),
};

const routes: Array<[string, unknown]> = [
  ["review:changes_requested", fx("search_backstop")],
  ["updated:>=", fx("search_windowed")],
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
    const rec = (raws as Array<{ pr: { number: number }; checkRollup: unknown[] }>).find((r) => r.pr.number === 42)!;
    expect(rec.checkRollup).toEqual([]);
  });
});
