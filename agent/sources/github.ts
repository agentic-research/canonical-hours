import { z } from "zod";
import {
  Artifact,
  LifecycleEvent,
  Observation,
  Source,
  canonicalPrUri,
} from "./source";
import type { FetchWindow } from "@canonical-hours/core";

/** One check-run/status-context conclusion, normalized across both union members at fetch time. */
export const CheckRollupEntrySchema = z.looseObject({
  name: z.string(),
  failing: z.boolean(),
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
  }),
  reviews: z.array(
    z.looseObject({
      author: z.string(), // "" if the review's author account was deleted (GraphQL Actor is nullable)
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
  repository: { owner: { login: string }; name: string };
  reviews: { nodes: Array<{ author: { login: string } | null; state: string; submittedAt: string | null; body: string | null; url?: string }> };
  comments: { nodes: Array<{ author: { login: string } | null; createdAt: string; body: string; url?: string }> };
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

function normalizeCheckRollup(rollup: GqlPullRequest["commits"]["nodes"][number]["commit"]["statusCheckRollup"]): CheckRollupEntry[] {
  if (!rollup) return [];
  return rollup.contexts.nodes.map((ctx) => {
    if (ctx.__typename === "CheckRun") {
      return { name: ctx.name as string, failing: FAILING_CHECK_CONCLUSIONS.has(ctx.conclusion as string) };
    }
    // StatusContext
    return { name: ctx.context as string, failing: FAILING_STATUS_STATES.has(ctx.state as string) };
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
          repository { owner { login } name }
          reviews(first: 50) { nodes { author { login } state submittedAt body url } }
          comments(first: 50) { nodes { author { login } createdAt body url } }
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
  ) {}

  /** POST one GraphQL query. Rate-limit backoff (Task 3) wraps this. */
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
      },
      reviews: node.reviews.nodes.map((r) => ({ author: r.author?.login ?? "", state: r.state, submittedAt: r.submittedAt, body: r.body, url: r.url })),
      comments: node.comments.nodes.map((c) => ({ author: c.author?.login ?? "", createdAt: c.createdAt, body: c.body, url: c.url })),
      checkRollup: normalizeCheckRollup(node.commits.nodes[0]?.commit.statusCheckRollup ?? null),
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
    return { artifact, observations, state_hint: rec.backstop ? "needs_you" : undefined };
  }

  async freshness(): Promise<string | null> {
    await this.searchPrs(`type:pr author:${this.login ?? "@me"}`);
    return this.now().toISOString();
  }
}
