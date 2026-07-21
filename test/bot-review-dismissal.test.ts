import { describe, it, expect } from "vitest";
import {
  fetchReviews,
  isBotReview,
  dismissPullRequestReviewMutation,
  dismissStaleBotReviews,
  BotReview,
} from "../agent/lib/bot-review-dismissal";

const ref = { owner: "o", repo: "r", number: 1 };

function fakeFetch(routes: Record<string, unknown>): typeof fetch {
  return (async (url: RequestInfo | URL, init?: RequestInit) => {
    const key = typeof url === "string" ? url : url.toString();
    if (key === "https://api.github.com/graphql") {
      const body = JSON.parse(String(init?.body));
      const routeKey = `graphql:${body.query.includes("dismissPullRequestReview") ? "dismissPullRequestReview" : "reviews"}`;
      if (routeKey in routes) return new Response(JSON.stringify(routes[routeKey]), { status: 200 });
    }
    if (key in routes) return new Response(JSON.stringify(routes[key]), { status: 200 });
    throw new Error(`no fixture for: ${key}`);
  }) as typeof fetch;
}

describe("fetchReviews", () => {
  it("returns reviews with authorIsBot derived from __typename", async () => {
    const fetchImpl = fakeFetch({
      "graphql:reviews": {
        data: {
          repository: {
            pullRequest: {
              reviews: {
                nodes: [
                  { id: "r1", state: "CHANGES_REQUESTED", submittedAt: "2026-07-16T14:00:00Z", author: { login: "codeql[bot]", __typename: "Bot" } },
                  { id: "r2", state: "APPROVED", submittedAt: "2026-07-16T15:00:00Z", author: { login: "mark", __typename: "User" } },
                ],
              },
            },
          },
        },
      },
    });
    const reviews = await fetchReviews(ref, "tok", fetchImpl);
    expect(reviews).toEqual([
      { id: "r1", authorLogin: "codeql[bot]", authorIsBot: true, state: "CHANGES_REQUESTED", submittedAt: "2026-07-16T14:00:00Z" },
      { id: "r2", authorLogin: "mark", authorIsBot: false, state: "APPROVED", submittedAt: "2026-07-16T15:00:00Z" },
    ]);
  });
});

describe("isBotReview", () => {
  const base: BotReview = { id: "r1", authorLogin: "mark", authorIsBot: false, state: "CHANGES_REQUESTED", submittedAt: "2026-07-16T14:00:00Z" };

  it("true when authorIsBot (GraphQL __typename === Bot)", () => {
    expect(isBotReview({ ...base, authorIsBot: true })).toBe(true);
  });

  it("true when login ends with [bot]", () => {
    expect(isBotReview({ ...base, authorLogin: "dependabot[bot]" })).toBe(true);
  });

  it("false for a human whose login merely contains \"-bot\" as a suffix — never pattern-match on a bare -bot suffix", () => {
    expect(isBotReview({ ...base, authorLogin: "cool-bot" })).toBe(false);
  });

  it("false for an ordinary human review", () => {
    expect(isBotReview(base)).toBe(false);
  });
});

describe("dismissPullRequestReviewMutation", () => {
  it("posts the dismissPullRequestReview mutation with id and message", async () => {
    let capturedBody: unknown;
    const fetchImpl = (async (_url: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify({ data: { dismissPullRequestReview: { pullRequestReview: { id: "r1" } } } }), { status: 200 });
    }) as typeof fetch;
    await dismissPullRequestReviewMutation("r1", "Fix commits landed after this review", "tok", fetchImpl);
    const vars = (capturedBody as { variables: { id: string; msg: string } }).variables;
    expect(vars.id).toBe("r1");
    expect(vars.msg).toBe("Fix commits landed after this review");
  });

  it("throws on a GraphQL error response", async () => {
    const fetchImpl = (async () =>
      new Response(JSON.stringify({ errors: [{ message: "not authorized" }] }), { status: 200 })) as typeof fetch;
    await expect(dismissPullRequestReviewMutation("r1", "msg", "tok", fetchImpl)).rejects.toThrow(/not authorized/);
  });
});

describe("dismissStaleBotReviews", () => {
  it("dismisses eligible CHANGES_REQUESTED bot reviews with a later fix commit, skips human/approved/no-fix-commit reviews, continues past a mutation failure", async () => {
    let mutationCalls = 0;
    const fetchImpl = (async (url: RequestInfo | URL, init?: RequestInit) => {
      const key = typeof url === "string" ? url : url.toString();
      if (key === "https://api.github.com/graphql") {
        const body = JSON.parse(String(init?.body));
        if (body.query.includes("dismissPullRequestReview")) {
          mutationCalls++;
          if (body.variables.id === "r-fail") {
            return new Response(JSON.stringify({ errors: [{ message: "422 unprocessable" }] }), { status: 200 });
          }
          return new Response(JSON.stringify({ data: { dismissPullRequestReview: { pullRequestReview: { id: body.variables.id } } } }), { status: 200 });
        }
        return new Response(
          JSON.stringify({
            data: {
              repository: {
                pullRequest: {
                  reviews: {
                    nodes: [
                      { id: "r-eligible", state: "CHANGES_REQUESTED", submittedAt: "2026-07-16T14:00:00Z", author: { login: "codeql[bot]", __typename: "Bot" } },
                      { id: "r-fail", state: "CHANGES_REQUESTED", submittedAt: "2026-07-16T14:00:00Z", author: { login: "another[bot]", __typename: "Bot" } },
                      { id: "r-nofixyet", state: "CHANGES_REQUESTED", submittedAt: "2026-07-20T00:00:00Z", author: { login: "codeql[bot]", __typename: "Bot" } },
                      { id: "r-human", state: "CHANGES_REQUESTED", submittedAt: "2026-07-16T14:00:00Z", author: { login: "mark", __typename: "User" } },
                      { id: "r-approved-bot", state: "APPROVED", submittedAt: "2026-07-16T14:00:00Z", author: { login: "codeql[bot]", __typename: "Bot" } },
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
        // Latest commit at 15:00 — after r-eligible/r-fail's 14:00 review, before r-nofixyet's 07-20 review.
        return new Response(JSON.stringify([{ commit: { author: { date: "2026-07-16T15:00:00Z" } } }]), { status: 200 });
      }
      throw new Error(`no fixture for: ${key}`);
    }) as typeof fetch;

    const result = await dismissStaleBotReviews(ref, "tok", fetchImpl);
    expect(result.dismissed).toEqual(["r-eligible"]);
    expect(result.skipped).toEqual(["r-nofixyet"]);
    expect(result.failed).toEqual([{ id: "r-fail", error: "422 unprocessable" }]);
    expect(mutationCalls).toBe(2); // r-eligible and r-fail attempted; r-nofixyet skipped before mutation, r-human/r-approved-bot never candidates
  });
});
