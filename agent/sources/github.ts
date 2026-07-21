import { z } from "zod";
import {
  Artifact,
  LifecycleEvent,
  Observation,
  Source,
  canonicalPrUri,
} from "./source";
import type { FetchWindow } from "@canonical-hours/core";

/** Composite record: one per PR, assembled by fetch() from REST responses. */
export const GithubPrRecordSchema = z.looseObject({
  pr: z.looseObject({
    number: z.number(),
    title: z.string(),
    html_url: z.string(),
    repository: z.string(), // "owner/repo"
    state: z.string(),
    merged_at: z.string().nullable(),
    closed_at: z.string().nullable(),
  }),
  reviews: z.array(
    z.looseObject({
      user: z.looseObject({ login: z.string() }),
      state: z.string(), // APPROVED | CHANGES_REQUESTED | COMMENTED | DISMISSED
      submitted_at: z.string().nullable(),
      body: z.string().nullable(),
      html_url: z.string().optional(),
    }),
  ),
  comments: z.array(
    z.looseObject({
      user: z.looseObject({ login: z.string() }),
      created_at: z.string(),
      body: z.string(),
      html_url: z.string().optional(),
    }),
  ),
  backstop: z.boolean(),
  viewer: z.string(),
});
export type GithubPrRecord = z.infer<typeof GithubPrRecordSchema>;

interface SearchItem {
  number: number;
  title: string;
  html_url: string;
  repository_url: string;
  state: string;
  closed_at: string | null;
  pull_request?: { merged_at: string | null };
}

function repoFromUrl(repositoryUrl: string): [string, string] {
  const parts = repositoryUrl.split("/");
  return [parts[parts.length - 2], parts[parts.length - 1]];
}

// GitHub review.state values (REST: GET /repos/{owner}/{repo}/pulls/{pr}/reviews)
// mapped to the local Source protocol's canonical observation vocabulary.
// COMMENTED and DISMISSED both carry no verdict weight, so they fold to
// "review_commented" rather than aliasing to approve/reject.
const REVIEW_TYPE: Record<string, string> = {
  APPROVED: "review_approved",
  CHANGES_REQUESTED: "review_changes_requested",
  COMMENTED: "review_commented",
  DISMISSED: "review_commented",
};

/**
 * GitHub is the sole hard-verdict source (design doc: lectio can observe
 * that a review happened but never its outcome — see agent/sources/lectio.ts
 * classifyLectioKind's doc comment). Every observation this adapter emits is
 * "hard": review verdicts, comments, and merge/close are all ground truth
 * read straight from the REST API, not derived/heuristic.
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

  /** Read-only REST with bounded in-tick backoff on rate limits. */
  private async gh(path: string): Promise<unknown> {
    const url = path.startsWith("http") ? path : `https://api.github.com${path}`;
    for (let attempt = 0; ; attempt++) {
      const res = await this.fetchImpl(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      if (res.status === 403 || res.status === 429) {
        const retryAfter = Number(res.headers.get("retry-after") ?? "0");
        if (attempt < 2 && retryAfter >= 0 && retryAfter <= 30) {
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          continue;
        }
        throw new Error(`github rate limited (status ${res.status})`);
      }
      if (!res.ok) throw new Error(`github ${res.status} for ${path}`);
      return res.json();
    }
  }

  private async getLogin(): Promise<string> {
    if (!this.login) {
      this.login = ((await this.gh("/user")) as { login: string }).login;
    }
    return this.login;
  }

  async fetch(window: FetchWindow): Promise<unknown[]> {
    const login = await this.getLogin();
    const sinceDate = window.since.toISOString().slice(0, 10);
    const windowed = (await this.gh(
      `/search/issues?q=${encodeURIComponent(`type:pr author:${login} updated:>=${sinceDate}`)}&per_page=50`,
    )) as { items: SearchItem[] };
    // Current-state backstop: open authored PRs with a standing
    // changes_requested review. Cursor-free by design — this is what keeps a
    // >72h-old unanswered review on the board even after it falls out of the
    // windowed `updated:>=` search above. Part of fetch(), not a tick-level
    // special case, so both queries share one rate-limit/backoff path.
    const backstop = (await this.gh(
      `/search/issues?q=${encodeURIComponent(`type:pr author:${login} state:open review:changes_requested`)}&per_page=50`,
    )) as { items: SearchItem[] };

    const key = (i: SearchItem) => `${i.repository_url}#${i.number}`;
    const all = new Map<string, { item: SearchItem; backstop: boolean }>();
    for (const item of windowed.items) all.set(key(item), { item, backstop: false });
    for (const item of backstop.items) {
      const existing = all.get(key(item));
      if (existing) existing.backstop = true;
      else all.set(key(item), { item, backstop: true });
    }

    const records: unknown[] = [];
    for (const { item, backstop: isBackstop } of all.values()) {
      const [owner, repo] = repoFromUrl(item.repository_url);
      const reviews = await this.gh(`/repos/${owner}/${repo}/pulls/${item.number}/reviews`);
      const comments = await this.gh(`/repos/${owner}/${repo}/issues/${item.number}/comments`);
      records.push({
        pr: {
          number: item.number,
          title: item.title,
          html_url: item.html_url,
          repository: `${owner}/${repo}`,
          state: item.state,
          merged_at: item.pull_request?.merged_at ?? null,
          closed_at: item.closed_at ?? null,
        },
        reviews,
        comments,
        backstop: isBackstop,
        viewer: login,
      });
    }
    return records;
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
      url: rec.pr.html_url,
    };
    const observations: Observation[] = [];
    for (const r of rec.reviews) {
      // PENDING reviews (submitted_at === null) are drafts GitHub only shows
      // to the reviewer themselves — not real activity from the PR author's
      // perspective yet, and ObservationSchema.at requires a non-empty
      // string, so there's no valid timestamp to emit anyway. Skip rather
      // than fabricate one.
      if (r.submitted_at === null) continue;
      const isOwn = r.user.login === rec.viewer;
      observations.push({
        artifact_uri: artifact.uri,
        at: r.submitted_at,
        author: r.user.login,
        type: isOwn ? "own_reply" : (REVIEW_TYPE[r.state] ?? "review"),
        payload: { preview: (r.body ?? "").slice(0, 200), url: r.html_url ?? "" },
        classification: "hard",
      });
    }
    for (const c of rec.comments) {
      const isOwn = c.user.login === rec.viewer;
      observations.push({
        artifact_uri: artifact.uri,
        at: c.created_at,
        author: c.user.login,
        type: isOwn ? "own_reply" : "comment",
        payload: { preview: c.body.slice(0, 200), url: c.html_url ?? "" },
        classification: "hard",
      });
    }
    if (rec.pr.merged_at) {
      observations.push({
        artifact_uri: artifact.uri,
        at: rec.pr.merged_at,
        author: "",
        type: "merge",
        payload: {},
        classification: "hard",
      });
    } else if (rec.pr.state === "closed" && rec.pr.closed_at) {
      observations.push({
        artifact_uri: artifact.uri,
        at: rec.pr.closed_at,
        author: "",
        type: "close",
        payload: {},
        classification: "hard",
      });
    }
    return { artifact, observations, state_hint: rec.backstop ? "needs_you" : undefined };
  }

  /** Live API — data is fresh as of the call. Also exercises auth/backoff via /user. */
  async freshness(): Promise<string | null> {
    await this.getLogin();
    return this.now().toISOString();
  }
}
