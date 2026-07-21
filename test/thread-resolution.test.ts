import { describe, it, expect } from "vitest";
import {
  fetchUnresolvedThreads,
  filesChangedAfter,
  eligibleToResolve,
  resolveReviewThreadMutation,
  resolveAddressedThreads,
  UnresolvedThread,
} from "../agent/lib/thread-resolution";

const ref = { owner: "o", repo: "r", number: 1 };

/** Routes by exact URL match (GraphQL POST and REST GETs share no URL, unlike github.ts's single-endpoint faking). */
function fakeFetch(routes: Record<string, unknown>): typeof fetch {
  return (async (url: RequestInfo | URL, init?: RequestInit) => {
    const key = typeof url === "string" ? url : url.toString();
    if (key === "https://api.github.com/graphql") {
      const body = JSON.parse(String(init?.body));
      const routeKey = `graphql:${body.query.includes("resolveReviewThread") ? "resolveReviewThread" : "reviewThreads"}`;
      if (routeKey in routes) return new Response(JSON.stringify(routes[routeKey]), { status: 200 });
    }
    if (key in routes) return new Response(JSON.stringify(routes[key]), { status: 200 });
    throw new Error(`no fixture for: ${key}`);
  }) as typeof fetch;
}

describe("fetchUnresolvedThreads", () => {
  it("returns only unresolved threads with their originating review's submittedAt", async () => {
    const fetchImpl = fakeFetch({
      "graphql:reviewThreads": {
        data: {
          repository: {
            pullRequest: {
              reviewThreads: {
                nodes: [
                  {
                    id: "t1",
                    isResolved: false,
                    path: "src/a.ts",
                    comments: { nodes: [{ pullRequestReview: { submittedAt: "2026-07-16T14:00:00Z" } }] },
                  },
                  { id: "t2", isResolved: true, path: "src/b.ts", comments: { nodes: [] } },
                ],
              },
            },
          },
        },
      },
    });
    const threads = await fetchUnresolvedThreads(ref, "tok", fetchImpl);
    expect(threads).toEqual([{ id: "t1", path: "src/a.ts", reviewSubmittedAt: "2026-07-16T14:00:00Z" }]);
  });
});

describe("filesChangedAfter", () => {
  it("unions filenames from commits strictly after the given timestamp", async () => {
    const fetchImpl = fakeFetch({
      "https://api.github.com/repos/o/r/pulls/1/commits": [
        { sha: "old", commit: { author: { date: "2026-07-16T10:00:00Z" } } },
        { sha: "new1", commit: { author: { date: "2026-07-16T15:00:00Z" } } },
        { sha: "new2", commit: { author: { date: "2026-07-16T16:00:00Z" } } },
      ],
      "https://api.github.com/repos/o/r/commits/new1": { files: [{ filename: "src/a.ts" }] },
      "https://api.github.com/repos/o/r/commits/new2": { files: [{ filename: "src/c.ts" }] },
    });
    const files = await filesChangedAfter(ref, "2026-07-16T14:00:00Z", "tok", fetchImpl);
    expect(files).toEqual(new Set(["src/a.ts", "src/c.ts"]));
  });
});

describe("eligibleToResolve", () => {
  it("a thread is eligible iff its path is in the post-review changed-file set for its own review timestamp", () => {
    const threads: UnresolvedThread[] = [
      { id: "t1", path: "src/a.ts", reviewSubmittedAt: "2026-07-16T14:00:00Z" },
      { id: "t2", path: "src/z.ts", reviewSubmittedAt: "2026-07-16T14:00:00Z" },
      { id: "t3", path: "src/a.ts", reviewSubmittedAt: null },
    ];
    const changedFilesByReviewTimestamp = new Map([["2026-07-16T14:00:00Z", new Set(["src/a.ts"])]]);
    const eligible = eligibleToResolve(threads, changedFilesByReviewTimestamp);
    expect(eligible.map((t) => t.id)).toEqual(["t1"]);
  });
});

describe("resolveReviewThreadMutation", () => {
  it("posts the resolveReviewThread mutation with the thread id", async () => {
    let capturedBody: unknown;
    const fetchImpl = (async (_url: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify({ data: { resolveReviewThread: { thread: { isResolved: true } } } }), { status: 200 });
    }) as typeof fetch;
    await resolveReviewThreadMutation("t1", "tok", fetchImpl);
    expect((capturedBody as { variables: { id: string } }).variables.id).toBe("t1");
  });

  it("throws on a GraphQL error response", async () => {
    const fetchImpl = (async () =>
      new Response(JSON.stringify({ errors: [{ message: "already resolved" }] }), { status: 200 })) as typeof fetch;
    await expect(resolveReviewThreadMutation("t1", "tok", fetchImpl)).rejects.toThrow(/already resolved/);
  });
});

describe("resolveAddressedThreads", () => {
  it("resolves eligible threads, skips ineligible ones, and continues past a mutation failure", async () => {
    let mutationCalls = 0;
    const fetchImpl = (async (url: RequestInfo | URL, init?: RequestInit) => {
      const key = typeof url === "string" ? url : url.toString();
      if (key === "https://api.github.com/graphql") {
        const body = JSON.parse(String(init?.body));
        if (body.query.includes("resolveReviewThread")) {
          mutationCalls++;
          if (body.variables.id === "t-fail") {
            return new Response(JSON.stringify({ errors: [{ message: "permission denied" }] }), { status: 200 });
          }
          return new Response(JSON.stringify({ data: { resolveReviewThread: { thread: { isResolved: true } } } }), { status: 200 });
        }
        // reviewThreads query
        return new Response(
          JSON.stringify({
            data: {
              repository: {
                pullRequest: {
                  reviewThreads: {
                    nodes: [
                      {
                        id: "t-eligible",
                        isResolved: false,
                        path: "src/a.ts",
                        comments: { nodes: [{ pullRequestReview: { submittedAt: "2026-07-16T14:00:00Z" } }] },
                      },
                      {
                        id: "t-fail",
                        isResolved: false,
                        path: "src/b.ts",
                        comments: { nodes: [{ pullRequestReview: { submittedAt: "2026-07-16T14:00:00Z" } }] },
                      },
                      {
                        id: "t-untouched",
                        isResolved: false,
                        path: "src/never-changed.ts",
                        comments: { nodes: [{ pullRequestReview: { submittedAt: "2026-07-16T14:00:00Z" } }] },
                      },
                    ],
                  },
                },
              },
            },
          }),
          { status: 200 },
        );
      }
      if (key === "https://api.github.com/repos/o/r/pulls/1/commits") {
        return new Response(
          JSON.stringify([{ sha: "fix1", commit: { author: { date: "2026-07-16T15:00:00Z" } } }]),
          { status: 200 },
        );
      }
      if (key === "https://api.github.com/repos/o/r/commits/fix1") {
        return new Response(JSON.stringify({ files: [{ filename: "src/a.ts" }, { filename: "src/b.ts" }] }), { status: 200 });
      }
      throw new Error(`no fixture for: ${key}`);
    }) as typeof fetch;

    const result = await resolveAddressedThreads(ref, "tok", fetchImpl);
    expect(result.resolved).toEqual(["t-eligible"]);
    expect(result.skipped).toEqual(["t-untouched"]);
    expect(result.failed).toEqual([{ id: "t-fail", error: "permission denied" }]);
    expect(mutationCalls).toBe(2); // t-eligible and t-fail both attempted; t-untouched never attempted
  });
});
