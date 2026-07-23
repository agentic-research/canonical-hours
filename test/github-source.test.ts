import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { GithubSource } from "../agent/lib/sources/github";
import { SearchPrsQuerySchema } from "../agent/lib/sources/generated/github";

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

const FIXED_NOW = () => new Date("2026-07-21T12:00:00Z");

// search_windowed's PR #42 always carries two failing checks (Task 4 fixture),
// so every test that fetches through the shared routes needs the conditional
// isRequired resolution satisfied by default; per-test overrides shadow it
// (see fakeFetch's last-match-wins behavior above).
const routes: Array<[string, unknown]> = [
  ["review:changes_requested", fx("search_backstop")],
  ["updated:>=", fx("search_windowed")],
  // Alias is by array index in needsRequiredCheck, not PR number (fix for the
  // multi-repo same-number alias collision the final review flagged) — PR #42
  // is the only entry needing the conditional query in these fixtures, so its
  // index is always 0.
  ["pr0:", fx("required_check_isrequired")],
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
    const source = new GithubSource("t", fakeFetch(lowLimitThenNormal), FIXED_NOW, 200, fakeSleep);
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
    // pr0's mergedAt/closedAt are both null (search_windowed fixture) — the
    // check_failed observation's timestamp falls back to the injectable
    // clock (canonical-hours-8ac6ec), not wall-clock time. FIXED_NOW here,
    // asserted against below, is what actually proves that.
    const source = new GithubSource(
      "t",
      fakeFetch([...routes, ["pr0:", fx("required_check_isrequired")]]),
      FIXED_NOW,
    );
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 42)!;
    const event = source.mapToLifecycleEvent(rec);
    expect(event.state_hint).toBe("needs_you");
    const checkObs = event.observations.find((o) => o.type === "check_failed")!;
    expect(checkObs).toBeDefined();
    expect(checkObs.classification).toBe("hard");
    expect(checkObs.payload.name).toBe("ci-required");
    expect(checkObs.at).toBe(FIXED_NOW().toISOString());
    // The non-required failing check must NOT produce its own check_failed observation.
    expect(event.observations.filter((o) => o.type === "check_failed")).toHaveLength(1);
  });

  it("a failing NON-required check alone does not set needs_you", async () => {
    // Same fixture, but the conditional isRequired response says both are non-required.
    const bothOptional = {
      data: {
        rateLimit: { remaining: 4989, resetAt: "2026-07-21T12:00:00Z" },
        pr0: {
          pullRequest: {
            commits: { nodes: [ { commit: { statusCheckRollup: { contexts: { nodes: [
              { __typename: "CheckRun", name: "ci-required", conclusion: "FAILURE", isRequired: false },
              { __typename: "CheckRun", name: "ci-optional", conclusion: "FAILURE", isRequired: false },
            ] } } } } ] },
          },
        },
      },
    };
    const source = new GithubSource("t", fakeFetch([...routes, ["pr0:", bothOptional]]));
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
      // Check for the conditional query's distinctive content, not a specific
      // alias name — aliases are by array index, not PR number, so this must
      // not assume which index (if any) would be used.
      if (body.includes("isRequired(pullRequestNumber:")) conditionalCalled = true;
      return fakeFetch(noFailuresRoutes)(url, init);
    }) as typeof fetch;
    const source = new GithubSource("t", trackingFetch);
    await source.fetch(window);
    expect(conditionalCalled).toBe(false);
  });

  it("two PRs with the SAME number in DIFFERENT repos, both failing, resolve required-ness independently", async () => {
    // Regression test for a real bug the final review caught: aliasing the
    // conditional query by bare PR number (pr${number}) collides whenever two
    // different repos both have a PR with that number and a failing check in
    // the same tick — routine for a source that fetches across every repo the
    // viewer has touched (every repo has a #1). Aliasing by array index fixes
    // this; this test proves the fix actually resolves each PR's required
    // flags independently rather than crashing or cross-contaminating.
    const sameNumberWindowed = {
      data: {
        rateLimit: { remaining: 4999, resetAt: "2026-07-21T12:00:00Z" },
        viewer: { login: "jamestexas" },
        search: {
          nodes: [
            {
              __typename: "PullRequest",
              number: 1,
              title: "repo-a PR #1",
              url: "https://github.com/owner-a/repo-a/pull/1",
              state: "OPEN",
              mergedAt: null,
              closedAt: null,
              reviewDecision: null,
              mergeable: "MERGEABLE",
              mergeStateStatus: "UNSTABLE",
              repository: { owner: { login: "owner-a", __typename: "User" }, name: "repo-a" },
              reviews: { nodes: [] },
              comments: { nodes: [] },
              reviewThreads: { nodes: [] },
              commits: { nodes: [ { commit: { statusCheckRollup: { contexts: { nodes: [
                { __typename: "CheckRun", name: "ci", conclusion: "FAILURE" },
              ] } } } } ] },
            },
            {
              __typename: "PullRequest",
              number: 1,
              title: "repo-b PR #1",
              url: "https://github.com/owner-b/repo-b/pull/1",
              state: "OPEN",
              mergedAt: null,
              closedAt: null,
              reviewDecision: null,
              mergeable: "MERGEABLE",
              mergeStateStatus: "UNSTABLE",
              repository: { owner: { login: "owner-b", __typename: "User" }, name: "repo-b" },
              reviews: { nodes: [] },
              comments: { nodes: [] },
              reviewThreads: { nodes: [] },
              commits: { nodes: [ { commit: { statusCheckRollup: { contexts: { nodes: [
                { __typename: "CheckRun", name: "ci", conclusion: "FAILURE" },
              ] } } } } ] },
            },
          ],
        },
      },
    };
    const emptyBackstop = {
      data: {
        rateLimit: { remaining: 4998, resetAt: "2026-07-21T12:00:00Z" },
        viewer: { login: "jamestexas" },
        search: { nodes: [] },
      },
    };
    // Both PRs need the conditional query — order matches insertion order
    // (windowed nodes first), so repo-a is index 0, repo-b is index 1.
    const conditionalResponse = {
      data: {
        rateLimit: { remaining: 4997, resetAt: "2026-07-21T12:00:00Z" },
        pr0: { pullRequest: { commits: { nodes: [ { commit: { statusCheckRollup: { contexts: { nodes: [
          { __typename: "CheckRun", name: "ci", isRequired: true },
        ] } } } } ] } } },
        pr1: { pullRequest: { commits: { nodes: [ { commit: { statusCheckRollup: { contexts: { nodes: [
          { __typename: "CheckRun", name: "ci", isRequired: false },
        ] } } } } ] } } },
      },
    };
    const sameNumberRoutes: Array<[string, unknown]> = [
      ["updated:>=", sameNumberWindowed],
      ["review:changes_requested", emptyBackstop],
      ["pr0:", conditionalResponse],
    ];
    const source = new GithubSource("t", fakeFetch(sameNumberRoutes));
    const raws = (await source.fetch(window)) as Array<{ pr: { repository: string; number: number }; checkRollup: Array<{ name: string; required: boolean }> }>;
    expect(raws).toHaveLength(2);
    const repoA = raws.find((r) => r.pr.repository === "owner-a/repo-a")!;
    const repoB = raws.find((r) => r.pr.repository === "owner-b/repo-b")!;
    expect(repoA.pr.number).toBe(1);
    expect(repoB.pr.number).toBe(1);
    expect(repoA.checkRollup.find((c) => c.name === "ci")?.required).toBe(true);
    expect(repoB.checkRollup.find((c) => c.name === "ci")?.required).toBe(false);
  });

  it("fetch surfaces reviewDecision, mergeable, mergeStateStatus, and unresolvedThreads on the raw record", async () => {
    const source = new GithubSource("t", fakeFetch(routes));
    const raws = (await source.fetch(window)) as Array<{
      pr: { number: number; reviewDecision: string | null; mergeable: string; mergeStateStatus: string };
      unresolvedThreads: Array<{ id: string; path: string; reviewSubmittedAt: string | null }>;
    }>;
    const rec = raws.find((r) => r.pr.number === 42)!;
    expect(rec.pr.reviewDecision).toBe("CHANGES_REQUESTED");
    expect(rec.pr.mergeable).toBe("MERGEABLE");
    expect(rec.pr.mergeStateStatus).toBe("BLOCKED");
    expect(rec.unresolvedThreads).toEqual([
      { id: "PRRT_1", path: "src/foo.ts", reviewSubmittedAt: "2026-07-16T14:00:00Z" },
    ]);
  });

  it("reviews carry id and authorIsBot", async () => {
    const source = new GithubSource("t", fakeFetch(routes));
    const raws = (await source.fetch(window)) as Array<{
      pr: { number: number };
      reviews: Array<{ id: string; author: string; authorIsBot: boolean }>;
    }>;
    const rec = raws.find((r) => r.pr.number === 42)!;
    expect(rec.reviews[0]).toMatchObject({ id: "PRR_1", author: "mark", authorIsBot: false });
  });

  it("merge_ready is true when approved, no failing required checks, and no unresolved threads", async () => {
    const cleanPr = {
      data: {
        rateLimit: { remaining: 4999, resetAt: "2026-07-21T12:00:00Z" },
        viewer: { login: "jamestexas" },
        search: {
          nodes: [
            {
              __typename: "PullRequest",
              number: 99,
              title: "clean PR",
              url: "https://github.com/jamestexas/agents/pull/99",
              state: "OPEN",
              mergedAt: null,
              closedAt: null,
              reviewDecision: "APPROVED",
              mergeable: "MERGEABLE",
              mergeStateStatus: "CLEAN",
              repository: { owner: { login: "jamestexas", __typename: "User" }, name: "agents" },
              reviews: { nodes: [] },
              comments: { nodes: [] },
              reviewThreads: { nodes: [] },
              commits: { nodes: [{ commit: { statusCheckRollup: null } }] },
            },
          ],
        },
      },
    };
    const cleanRoutes: Array<[string, unknown]> = [
      ["updated:>=", cleanPr],
      ["review:changes_requested", fx("search_backstop")],
    ];
    const source = new GithubSource("t", fakeFetch(cleanRoutes));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 99)!;
    const event = source.mapToLifecycleEvent(rec);
    expect(event.extra).toEqual({ merge_ready: true });
  });

  it("merge_ready is false for PR #42 (CHANGES_REQUESTED + failing required check + unresolved thread, all three at once)", async () => {
    // PR #42 in the shared `routes` fixture fails all three merge_ready
    // conditions simultaneously — this is a general sanity check, NOT a
    // condition-isolation test (see the two tests below for that: each one
    // fails on exactly ONE condition, so a regression dropping any single
    // clause from the merge_ready computation would still be caught).
    const source = new GithubSource("t", fakeFetch(routes));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 42)!;
    const event = source.mapToLifecycleEvent(rec);
    expect(event.extra).toEqual({ merge_ready: false });
  });

  it("merge_ready is false when ONLY a required check is failing (approved, no unresolved threads)", async () => {
    const approvedButFailingCheck = {
      data: {
        rateLimit: { remaining: 4999, resetAt: "2026-07-21T12:00:00Z" },
        viewer: { login: "jamestexas" },
        search: {
          nodes: [
            {
              __typename: "PullRequest",
              number: 101,
              title: "approved but CI is red",
              url: "https://github.com/jamestexas/agents/pull/101",
              state: "OPEN",
              mergedAt: null,
              closedAt: null,
              reviewDecision: "APPROVED",
              mergeable: "MERGEABLE",
              mergeStateStatus: "BLOCKED",
              repository: { owner: { login: "jamestexas", __typename: "User" }, name: "agents" },
              reviews: { nodes: [] },
              comments: { nodes: [] },
              reviewThreads: { nodes: [] },
              commits: {
                nodes: [
                  {
                    commit: {
                      statusCheckRollup: {
                        contexts: { nodes: [{ __typename: "CheckRun", name: "ci-required", conclusion: "FAILURE" }] },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };
    const isRequiredResponse = {
      data: {
        rateLimit: { remaining: 4998, resetAt: "2026-07-21T12:00:00Z" },
        pr0: {
          pullRequest: {
            commits: {
              nodes: [
                {
                  commit: {
                    statusCheckRollup: {
                      contexts: { nodes: [{ __typename: "CheckRun", name: "ci-required", isRequired: true }] },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    };
    const failingCheckRoutes: Array<[string, unknown]> = [
      ["updated:>=", approvedButFailingCheck],
      ["review:changes_requested", fx("search_backstop")],
      ["pr0:", isRequiredResponse],
    ];
    const source = new GithubSource("t", fakeFetch(failingCheckRoutes));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 101)!;
    const event = source.mapToLifecycleEvent(rec);
    expect(event.extra).toEqual({ merge_ready: false });
  });

  it("merge_ready is false when ONLY reviewDecision is CHANGES_REQUESTED (all checks green, no unresolved threads)", async () => {
    const changesRequestedButGreen = {
      data: {
        rateLimit: { remaining: 4999, resetAt: "2026-07-21T12:00:00Z" },
        viewer: { login: "jamestexas" },
        search: {
          nodes: [
            {
              __typename: "PullRequest",
              number: 102,
              title: "changes requested but CI is green",
              url: "https://github.com/jamestexas/agents/pull/102",
              state: "OPEN",
              mergedAt: null,
              closedAt: null,
              reviewDecision: "CHANGES_REQUESTED",
              mergeable: "MERGEABLE",
              mergeStateStatus: "BLOCKED",
              repository: { owner: { login: "jamestexas", __typename: "User" }, name: "agents" },
              reviews: { nodes: [] },
              comments: { nodes: [] },
              reviewThreads: { nodes: [] },
              commits: { nodes: [{ commit: { statusCheckRollup: null } }] },
            },
          ],
        },
      },
    };
    const changesRequestedRoutes: Array<[string, unknown]> = [
      ["updated:>=", changesRequestedButGreen],
      ["review:changes_requested", fx("search_backstop")],
    ];
    const source = new GithubSource("t", fakeFetch(changesRequestedRoutes));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 102)!;
    const event = source.mapToLifecycleEvent(rec);
    expect(event.extra).toEqual({ merge_ready: false });
  });

  it("merge_ready is false when there are unresolved review threads even if approved and green", async () => {
    const approvedWithThread = {
      data: {
        rateLimit: { remaining: 4999, resetAt: "2026-07-21T12:00:00Z" },
        viewer: { login: "jamestexas" },
        search: {
          nodes: [
            {
              __typename: "PullRequest",
              number: 100,
              title: "approved but has an open thread",
              url: "https://github.com/jamestexas/agents/pull/100",
              state: "OPEN",
              mergedAt: null,
              closedAt: null,
              reviewDecision: "APPROVED",
              mergeable: "MERGEABLE",
              mergeStateStatus: "BLOCKED",
              repository: { owner: { login: "jamestexas", __typename: "User" }, name: "agents" },
              reviews: { nodes: [] },
              comments: { nodes: [] },
              reviewThreads: {
                nodes: [
                  {
                    id: "PRRT_2",
                    isResolved: false,
                    path: "src/bar.ts",
                    comments: { nodes: [{ pullRequestReview: { submittedAt: "2026-07-16T14:00:00Z" } }] },
                  },
                ],
              },
              commits: { nodes: [{ commit: { statusCheckRollup: null } }] },
            },
          ],
        },
      },
    };
    const threadRoutes: Array<[string, unknown]> = [
      ["updated:>=", approvedWithThread],
      ["review:changes_requested", fx("search_backstop")],
    ];
    const source = new GithubSource("t", fakeFetch(threadRoutes));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 100)!;
    const event = source.mapToLifecycleEvent(rec);
    expect(event.extra).toEqual({ merge_ready: false });
  });

  it("merge_ready is true when reviewDecision is null (no review required)", async () => {
    // search_backstop's PR #7 has reviewDecision: null, no threads, no checks.
    const source = new GithubSource("t", fakeFetch(routes));
    const raws = await source.fetch(window);
    const rec = (raws as Array<{ pr: { number: number } }>).find((r) => r.pr.number === 7)!;
    const event = source.mapToLifecycleEvent(rec);
    expect(event.extra).toEqual({ merge_ready: true });
  });
});

describe("SearchPrsQuerySchema (codegen)", () => {
  it("accepts the real existing fixture", () => {
    expect(() => SearchPrsQuerySchema().parse(fx("search_windowed").data)).not.toThrow();
  });

  it("rejects a fixture with a required field removed (drift detection)", () => {
    const drifted = fx("search_windowed");
    delete drifted.data.search.nodes[0].number;
    expect(() => SearchPrsQuerySchema().parse(drifted.data)).toThrow();
  });

  it("rejects a fixture with the wrong type for a scalar field", () => {
    const drifted = fx("search_windowed");
    drifted.data.search.nodes[0].number = "not-a-number";
    expect(() => SearchPrsQuerySchema().parse(drifted.data)).toThrow();
  });
});
