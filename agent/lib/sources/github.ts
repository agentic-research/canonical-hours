import { z } from "zod";
import {
  Artifact,
  LifecycleEvent,
  Observation,
  Source,
  canonicalPrUri,
} from "@agentic-research/vespers-core";
import type { FetchWindow } from "@agentic-research/vespers-core";
import { SearchPrsQuerySchema } from "./generated/github";

/** One check-run/status-context conclusion, normalized across both union members at fetch time. */
export const CheckRollupEntrySchema = z.looseObject({
  name: z.string(),
  failing: z.boolean(),
  required: z.boolean(),
});
export type CheckRollupEntry = z.infer<typeof CheckRollupEntrySchema>;

/** Composite record: one per PR, assembled by fetch() from GraphQL responses. */
export const GithubPrRecordSchema = z.looseObject({
  pr: z.looseObject({
    number: z.number(),
    title: z.string(),
    url: z.string(),
    repository: z.string(), // "owner/repo"
    state: z.string(),
    mergedAt: z.string().nullable(),
    closedAt: z.string().nullable(),
    reviewDecision: z.string().nullable(),
    mergeable: z.string(),
    mergeStateStatus: z.string(),
  }),
  reviews: z.array(
    z.looseObject({
      id: z.string(),
      author: z.string(), // "" if the review's author account was deleted (GraphQL Actor is nullable)
      authorIsBot: z.boolean(),
      state: z.string(), // APPROVED | CHANGES_REQUESTED | COMMENTED | DISMISSED
      submittedAt: z.string().nullable(),
      body: z.string().nullable(),
      url: z.string().optional(),
    }),
  ),
  comments: z.array(
    z.looseObject({
      author: z.string(),
      createdAt: z.string(),
      body: z.string(),
      url: z.string().optional(),
    }),
  ),
  checkRollup: z.array(CheckRollupEntrySchema),
  unresolvedThreads: z.array(
    z.looseObject({
      id: z.string(),
      path: z.string(),
      reviewSubmittedAt: z.string().nullable(),
    }),
  ),
  backstop: z.boolean(),
  viewer: z.string(),
});
export type GithubPrRecord = z.infer<typeof GithubPrRecordSchema>;

// GitHub review.state values (REST and GraphQL share the same enum strings)
// mapped to the local Source protocol's canonical observation vocabulary.
const REVIEW_TYPE: Record<string, string> = {
  APPROVED: "review_approved",
  CHANGES_REQUESTED: "review_changes_requested",
  COMMENTED: "review_commented",
  DISMISSED: "review_commented",
};

/** GraphQL response shapes — only the fields this adapter reads. */
interface GqlPullRequest {
  number: number;
  title: string;
  url: string;
  state: string;
  mergedAt: string | null;
  closedAt: string | null;
  reviewDecision: string | null;
  mergeable: string;
  mergeStateStatus: string;
  repository: { owner: { login: string; __typename: string }; name: string };
  reviews: {
    nodes: Array<{
      id: string;
      author: { login: string; __typename: string } | null;
      state: string;
      submittedAt: string | null;
      body: string | null;
      url?: string;
    }>;
  };
  comments: { nodes: Array<{ author: { login: string; __typename: string } | null; createdAt: string; body: string; url?: string }> };
  reviewThreads: {
    nodes: Array<{
      id: string;
      isResolved: boolean;
      path: string;
      comments: { nodes: Array<{ pullRequestReview: { submittedAt: string } | null }> };
    }>;
  };
  commits: { nodes: Array<{ commit: { statusCheckRollup: { contexts: { nodes: Array<Record<string, unknown>> } } | null } }> };
}
interface GqlSearchResponse {
  data: {
    rateLimit: { remaining: number; resetAt: string };
    viewer: { login: string };
    search: { nodes: GqlPullRequest[] };
  };
  errors?: Array<{ message: string }>;
}

const FAILING_CHECK_CONCLUSIONS = new Set(["FAILURE", "TIMED_OUT", "ACTION_REQUIRED"]);
const FAILING_STATUS_STATES = new Set(["FAILURE", "ERROR"]);

function normalizeCheckRollup(
  rollup: GqlPullRequest["commits"]["nodes"][number]["commit"]["statusCheckRollup"],
  requiredNames: Set<string> = new Set(),
): CheckRollupEntry[] {
  if (!rollup) return [];
  return rollup.contexts.nodes.map((ctx) => {
    const name = (ctx.__typename === "CheckRun" ? ctx.name : ctx.context) as string;
    const failing =
      ctx.__typename === "CheckRun"
        ? FAILING_CHECK_CONCLUSIONS.has(ctx.conclusion as string)
        : FAILING_STATUS_STATES.has(ctx.state as string);
    return { name, failing, required: requiredNames.has(name) };
  });
}

const SEARCH_QUERY = `
  query($q: String!) {
    rateLimit { remaining resetAt }
    viewer { login }
    search(query: $q, type: ISSUE, first: 50) {
      nodes {
        __typename
        ... on PullRequest {
          number title url state mergedAt closedAt
          reviewDecision mergeable mergeStateStatus
          repository { owner { login __typename } name }
          reviews(first: 50) { nodes { id author { login __typename } state submittedAt body url } }
          comments(first: 50) { nodes { author { login __typename } createdAt body url } }
          reviewThreads(first: 50) {
            nodes {
              id
              isResolved
              path
              comments(first: 1) {
                nodes { pullRequestReview { submittedAt } }
              }
            }
          }
          commits(last: 1) {
            nodes {
              commit {
                statusCheckRollup {
                  contexts(first: 50) {
                    nodes {
                      __typename
                      ... on CheckRun { name conclusion }
                      ... on StatusContext { context state }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface GqlRequiredCheckResponse {
  data: { rateLimit: { remaining: number; resetAt: string } } & Record<
    string,
    | {
        pullRequest: {
          commits: {
            nodes: Array<{
              commit: {
                statusCheckRollup: {
                  contexts: {
                    nodes: Array<{
                      __typename: string;
                      name?: string;
                      context?: string;
                      isRequired: boolean;
                    }>;
                  };
                } | null;
              };
            }>;
          };
        } | null;
      }
    | null
  >;
  errors?: Array<{ message: string }>;
}

/**
 * Aliased, literal-number-per-PR query — isRequired cannot be batched inside
 * `search` (verified live). Requests `rateLimit` too: graphqlRequest's
 * backoff check (Task 3) reads json.data.rateLimit unconditionally, on
 * every request this method makes, not just the primary search ones.
 *
 * Aliases by ARRAY INDEX (`pr0`, `pr1`, ...), not by PR number: this source
 * fetches the viewer's own PRs across every repo they've touched, where
 * identical PR numbers across different repos are the norm (every repo has
 * a #1). Aliasing by number alone would emit duplicate alias names whenever
 * two same-numbered PRs from different repos both had a failing check in
 * the same tick, which GitHub's GraphQL API rejects outright — failing the
 * whole request, not just those PRs. The index is always unique regardless
 * of which repos are involved.
 */
function buildRequiredCheckQuery(prs: Array<{ owner: string; repo: string; number: number }>): string {
  const blocks = prs.map(
    ({ owner, repo, number }, index) => `
      pr${index}: repository(owner: "${owner}", name: "${repo}") {
        pullRequest(number: ${number}) {
          commits(last: 1) {
            nodes {
              commit {
                statusCheckRollup {
                  contexts(first: 50) {
                    nodes {
                      __typename
                      ... on CheckRun { name isRequired(pullRequestNumber: ${number}) }
                      ... on StatusContext { context isRequired(pullRequestNumber: ${number}) }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
  );
  return `query { rateLimit { remaining resetAt }${blocks.join("\n")}\n}`;
}

/**
 * GitHub is the sole hard-verdict source (design doc: lectio can observe
 * that a review happened but never its outcome). Every observation this
 * adapter emits is "hard": review verdicts, comments, and merge/close are
 * all ground truth read straight from the GraphQL API, not derived/heuristic.
 */
export class GithubSource implements Source {
  name = "github";
  schema = GithubPrRecordSchema;
  private login: string | null = null;

  constructor(
    private token: string,
    private fetchImpl: typeof fetch = fetch,
    private now: () => Date = () => new Date(),
    private minRemaining: number = 200,
    private sleepImpl: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms)),
  ) {}

  /** POST one GraphQL query, sleeping until rateLimit.resetAt if remaining drops below minRemaining. */
  private async graphqlRequest(query: string, variables: Record<string, unknown>): Promise<GqlSearchResponse> {
    const res = await this.fetchImpl("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`github graphql ${res.status}`);
    const json = (await res.json()) as GqlSearchResponse;
    if (json.errors?.length) throw new Error(`github graphql errors: ${json.errors.map((e) => e.message).join("; ")}`);
    // Only the primary search query's real shape is codegen-validated here —
    // buildRequiredCheckQuery's response is a separate, runtime-templated
    // query codegen can't target (out of scope, canonical-hours-c72328).
    // Validated against json.data specifically (not the full {data, errors}
    // envelope) — matches the generated schema's own shape, confirmed
    // against the earlier spike's own validate.mjs (`.parse(fixture.data)`).
    if (query === SEARCH_QUERY) {
      SearchPrsQuerySchema().parse(json.data);
    }
    if (json.data.rateLimit.remaining < this.minRemaining) {
      const waitMs = new Date(json.data.rateLimit.resetAt).getTime() - this.now().getTime();
      if (waitMs > 0) await this.sleepImpl(waitMs);
    }
    return json;
  }

  private async searchPrs(query: string): Promise<{ nodes: GqlPullRequest[] }> {
    const res = await this.graphqlRequest(SEARCH_QUERY, { q: query });
    this.login ??= res.data.viewer.login;
    return res.data.search;
  }

  async fetch(window: FetchWindow): Promise<unknown[]> {
    const sinceDate = window.since.toISOString().slice(0, 10);
    const windowed = await this.searchPrs(`type:pr author:${this.login ?? "@me"} updated:>=${sinceDate}`);
    const backstop = await this.searchPrs(`type:pr author:${this.login ?? "@me"} state:open review:changes_requested`);

    const key = (n: GqlPullRequest) => `${n.repository.owner.login}/${n.repository.name}#${n.number}`;
    const all = new Map<string, { node: GqlPullRequest; backstop: boolean }>();
    for (const node of windowed.nodes) all.set(key(node), { node, backstop: false });
    for (const node of backstop.nodes) {
      const existing = all.get(key(node));
      if (existing) existing.backstop = true;
      else all.set(key(node), { node, backstop: true });
    }

    // Any failing check (regardless of required-ness — we don't know yet) needs isRequired resolved.
    const needsRequiredCheck: Array<{ owner: string; repo: string; number: number }> = [];
    for (const { node } of all.values()) {
      const rollup = node.commits.nodes[0]?.commit.statusCheckRollup;
      const hasFailure = rollup?.contexts.nodes.some((ctx) =>
        ctx.__typename === "CheckRun"
          ? FAILING_CHECK_CONCLUSIONS.has(ctx.conclusion as string)
          : FAILING_STATUS_STATES.has(ctx.state as string),
      );
      if (hasFailure) needsRequiredCheck.push({ owner: node.repository.owner.login, repo: node.repository.name, number: node.number });
    }

    // Keyed by owner/repo#number (same composite format as `key()` above), not
    // bare PR number — a bare-number key would collide across repos.
    const requiredByPr = new Map<string, Set<string>>();
    if (needsRequiredCheck.length > 0) {
      const res = await this.graphqlRequest(buildRequiredCheckQuery(needsRequiredCheck), {});
      const withRequired = res as unknown as GqlRequiredCheckResponse;
      needsRequiredCheck.forEach(({ owner, repo, number }, index) => {
        const entry = withRequired.data[`pr${index}`];
        const names = new Set<string>();
        for (const ctx of entry?.pullRequest?.commits.nodes[0]?.commit.statusCheckRollup?.contexts.nodes ?? []) {
          if (ctx.isRequired) names.add((ctx.__typename === "CheckRun" ? ctx.name : ctx.context) as string);
        }
        requiredByPr.set(`${owner}/${repo}#${number}`, names);
      });
    }

    const login = this.login ?? "";
    return [...all.values()].map(({ node, backstop: isBackstop }) => ({
      pr: {
        number: node.number,
        title: node.title,
        url: node.url,
        repository: `${node.repository.owner.login}/${node.repository.name}`,
        state: node.state,
        mergedAt: node.mergedAt,
        closedAt: node.closedAt,
        reviewDecision: node.reviewDecision,
        mergeable: node.mergeable,
        mergeStateStatus: node.mergeStateStatus,
      },
      reviews: node.reviews.nodes.map((r) => ({
        id: r.id,
        author: r.author?.login ?? "",
        authorIsBot: r.author?.__typename === "Bot",
        state: r.state,
        submittedAt: r.submittedAt,
        body: r.body,
        url: r.url,
      })),
      comments: node.comments.nodes.map((c) => ({ author: c.author?.login ?? "", createdAt: c.createdAt, body: c.body, url: c.url })),
      checkRollup: normalizeCheckRollup(node.commits.nodes[0]?.commit.statusCheckRollup ?? null, requiredByPr.get(key(node)) ?? new Set()),
      unresolvedThreads: node.reviewThreads.nodes
        .filter((t) => !t.isResolved)
        .map((t) => ({
          id: t.id,
          path: t.path,
          reviewSubmittedAt: t.comments.nodes[0]?.pullRequestReview?.submittedAt ?? null,
        })),
      backstop: isBackstop,
      viewer: login,
    }));
  }

  mapToLifecycleEvent(raw: unknown): LifecycleEvent {
    const rec = GithubPrRecordSchema.parse(raw);
    const [owner, repo] = rec.pr.repository.split("/");
    const artifact: Artifact = {
      uri: canonicalPrUri(owner, repo, rec.pr.number),
      kind: "pr",
      repo: rec.pr.repository.toLowerCase(),
      number: rec.pr.number,
      title: rec.pr.title,
      url: rec.pr.url,
    };
    const observations: Observation[] = [];
    for (const r of rec.reviews) {
      if (r.submittedAt === null) continue;
      const isOwn = r.author === rec.viewer;
      observations.push({
        artifact_uri: artifact.uri,
        at: r.submittedAt,
        author: r.author,
        type: isOwn ? "own_reply" : (REVIEW_TYPE[r.state] ?? "review"),
        payload: { preview: (r.body ?? "").slice(0, 200), url: r.url ?? "" },
        classification: "hard",
      });
    }
    for (const c of rec.comments) {
      const isOwn = c.author === rec.viewer;
      observations.push({
        artifact_uri: artifact.uri,
        at: c.createdAt,
        author: c.author,
        type: isOwn ? "own_reply" : "comment",
        payload: { preview: c.body.slice(0, 200), url: c.url ?? "" },
        classification: "hard",
      });
    }
    if (rec.pr.mergedAt) {
      observations.push({ artifact_uri: artifact.uri, at: rec.pr.mergedAt, author: "", type: "merge", payload: {}, classification: "hard" });
    } else if (rec.pr.state === "CLOSED" && rec.pr.closedAt) {
      observations.push({ artifact_uri: artifact.uri, at: rec.pr.closedAt, author: "", type: "close", payload: {}, classification: "hard" });
    }
    const failingRequired = rec.checkRollup.filter((c) => c.failing && c.required);
    for (const check of failingRequired) {
      observations.push({
        artifact_uri: artifact.uri,
        at: rec.pr.mergedAt ?? rec.pr.closedAt ?? this.now().toISOString(),
        author: "",
        type: "check_failed",
        payload: { name: check.name },
        classification: "hard",
      });
    }
    // merge_ready: watch-pr.md §3's three explicit conditions, ported verbatim —
    // NOT GitHub's own broader mergeStateStatus, which also folds in merge-conflict
    // state that watch-pr's rule doesn't consider.
    const mergeReady =
      (rec.pr.reviewDecision === "APPROVED" || rec.pr.reviewDecision === null) &&
      failingRequired.length === 0 &&
      rec.unresolvedThreads.length === 0;
    return {
      artifact,
      observations,
      state_hint: rec.backstop || failingRequired.length > 0 ? "needs_you" : undefined,
      extra: { merge_ready: mergeReady },
    };
  }

  async freshness(): Promise<string | null> {
    await this.searchPrs(`type:pr author:${this.login ?? "@me"}`);
    return this.now().toISOString();
  }
}
