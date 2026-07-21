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

interface GqlRequiredCheckResponse {
  data: { rateLimit: { remaining: number; resetAt: string } } & Record<
    string,
    { commits: { nodes: Array<{ commit: { statusCheckRollup: { contexts: { nodes: Array<{ __typename: string; name?: string; context?: string; isRequired: boolean }> } } | null } }> } }
  >;
  errors?: Array<{ message: string }>;
}

/**
 * Aliased, literal-number-per-PR query — isRequired cannot be batched inside
 * `search` (verified live). Requests `rateLimit` too: graphqlRequest's
 * backoff check (Task 3) reads json.data.rateLimit unconditionally, on
 * every request this method makes, not just the primary search ones.
 */
function buildRequiredCheckQuery(prs: Array<{ owner: string; repo: string; number: number }>): string {
  const blocks = prs.map(
    ({ owner, repo, number }) => `
      pr${number}: repository(owner: "${owner}", name: "${repo}") {
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

    const requiredByPr = new Map<number, Set<string>>();
    if (needsRequiredCheck.length > 0) {
      const res = await this.graphqlRequest(buildRequiredCheckQuery(needsRequiredCheck), {});
      const withRequired = res as unknown as GqlRequiredCheckResponse;
      for (const { number } of needsRequiredCheck) {
        const entry = withRequired.data[`pr${number}`];
        const names = new Set<string>();
        for (const ctx of entry?.commits.nodes[0]?.commit.statusCheckRollup?.contexts.nodes ?? []) {
          if (ctx.isRequired) names.add((ctx.__typename === "CheckRun" ? ctx.name : ctx.context) as string);
        }
        requiredByPr.set(number, names);
      }
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
      checkRollup: normalizeCheckRollup(node.commits.nodes[0]?.commit.statusCheckRollup ?? null, requiredByPr.get(node.number) ?? new Set()),
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
        at: rec.pr.mergedAt ?? rec.pr.closedAt ?? new Date().toISOString(),
        author: "",
        type: "check_failed",
        payload: { name: check.name },
        classification: "hard",
      });
    }
    return {
      artifact,
      observations,
      state_hint: rec.backstop || failingRequired.length > 0 ? "needs_you" : undefined,
    };
  }

  async freshness(): Promise<string | null> {
    await this.searchPrs(`type:pr author:${this.login ?? "@me"}`);
    return this.now().toISOString();
  }
}
