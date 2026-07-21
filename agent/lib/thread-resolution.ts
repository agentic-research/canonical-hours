import type { PrRef } from "./pr-ref";
import { graphqlPost } from "./github-graphql";

export interface UnresolvedThread {
  id: string;
  path: string;
  reviewSubmittedAt: string | null;
}

const THREADS_QUERY = `
  query($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
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
      }
    }
  }
`;

interface GqlThreadsResponse {
  data: {
    repository: {
      pullRequest: {
        reviewThreads: {
          nodes: Array<{
            id: string;
            isResolved: boolean;
            path: string;
            comments: { nodes: Array<{ pullRequestReview: { submittedAt: string } | null }> };
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

/** Unresolved review threads on a PR, each with its originating review's submittedAt (null if unavailable). */
export async function fetchUnresolvedThreads(
  ref: PrRef,
  token: string,
  fetchImpl: typeof fetch = fetch,
): Promise<UnresolvedThread[]> {
  const json = await graphqlPost<GqlThreadsResponse>(THREADS_QUERY, ref as unknown as Record<string, unknown>, token, fetchImpl);
  return json.data.repository.pullRequest.reviewThreads.nodes
    .filter((t) => !t.isResolved)
    .map((t) => ({
      id: t.id,
      path: t.path,
      reviewSubmittedAt: t.comments.nodes[0]?.pullRequestReview?.submittedAt ?? null,
    }));
}

interface RestCommit {
  sha: string;
  commit: { author: { date: string } | null };
}
interface RestCommitDetail {
  files?: Array<{ filename: string }>;
}

async function restGet<T>(url: string, token: string, fetchImpl: typeof fetch): Promise<T> {
  const res = await fetchImpl(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`github rest ${res.status}`);
  return (await res.json()) as T;
}

/** Union of file paths touched by commits on this PR strictly after `afterIso` (REST — GraphQL has no per-commit changed-file field). */
export async function filesChangedAfter(
  ref: PrRef,
  afterIso: string,
  token: string,
  fetchImpl: typeof fetch = fetch,
): Promise<Set<string>> {
  const commits = await restGet<RestCommit[]>(
    `https://api.github.com/repos/${ref.owner}/${ref.repo}/pulls/${ref.number}/commits`,
    token,
    fetchImpl,
  );
  const after = commits.filter((c) => c.commit.author && c.commit.author.date > afterIso);

  const files = new Set<string>();
  for (const c of after) {
    const detail = await restGet<RestCommitDetail>(
      `https://api.github.com/repos/${ref.owner}/${ref.repo}/commits/${c.sha}`,
      token,
      fetchImpl,
    );
    for (const f of detail.files ?? []) files.add(f.filename);
  }
  return files;
}

/** Pure: which unresolved threads are eligible to auto-resolve, given each thread's own post-review changed-file set. */
export function eligibleToResolve(
  threads: UnresolvedThread[],
  changedFilesByReviewTimestamp: Map<string, Set<string>>,
): UnresolvedThread[] {
  return threads.filter((t) => {
    if (t.reviewSubmittedAt === null) return false;
    const changed = changedFilesByReviewTimestamp.get(t.reviewSubmittedAt);
    return changed !== undefined && changed.has(t.path);
  });
}

export async function resolveReviewThreadMutation(threadId: string, token: string, fetchImpl: typeof fetch = fetch): Promise<void> {
  await graphqlPost(
    `mutation($id: ID!) { resolveReviewThread(input: { threadId: $id }) { thread { isResolved } } }`,
    { id: threadId },
    token,
    fetchImpl,
  );
}

export interface ResolveResult {
  resolved: string[];
  skipped: string[];
  failed: Array<{ id: string; error: string }>;
}

/**
 * Orchestrates watch-pr.md §2c: fetch unresolved threads, resolve the ones
 * whose file changed after their originating review, continue past an
 * individual mutation failure (log/record, do not abort the whole run).
 */
export async function resolveAddressedThreads(ref: PrRef, token: string, fetchImpl: typeof fetch = fetch): Promise<ResolveResult> {
  const threads = await fetchUnresolvedThreads(ref, token, fetchImpl);
  const distinctTimestamps = [...new Set(threads.map((t) => t.reviewSubmittedAt).filter((t): t is string => t !== null))];
  const changedFilesByReviewTimestamp = new Map<string, Set<string>>();
  for (const ts of distinctTimestamps) {
    changedFilesByReviewTimestamp.set(ts, await filesChangedAfter(ref, ts, token, fetchImpl));
  }
  const eligible = eligibleToResolve(threads, changedFilesByReviewTimestamp);
  const eligibleIds = new Set(eligible.map((t) => t.id));

  const result: ResolveResult = { resolved: [], skipped: [], failed: [] };
  for (const t of threads) {
    if (!eligibleIds.has(t.id)) {
      result.skipped.push(t.id);
      continue;
    }
    try {
      await resolveReviewThreadMutation(t.id, token, fetchImpl);
      result.resolved.push(t.id);
    } catch (err) {
      result.failed.push({ id: t.id, error: err instanceof Error ? err.message : String(err) });
    }
  }
  return result;
}
