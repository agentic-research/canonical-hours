import type { PrRef } from "./pr-ref";
import { graphqlPost } from "./github-graphql";

export interface BotReview {
  id: string;
  authorLogin: string;
  authorIsBot: boolean;
  state: string;
  submittedAt: string;
}

const REVIEWS_QUERY = `
  query($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        reviews(first: 50) {
          nodes {
            id
            state
            submittedAt
            author { login __typename }
          }
        }
      }
    }
  }
`;

interface GqlReviewsResponse {
  data: {
    repository: {
      pullRequest: {
        reviews: {
          nodes: Array<{
            id: string;
            state: string;
            submittedAt: string | null;
            author: { login: string; __typename: string } | null;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export async function fetchReviews(ref: PrRef, token: string, fetchImpl: typeof fetch = fetch): Promise<BotReview[]> {
  const json = await graphqlPost<GqlReviewsResponse>(REVIEWS_QUERY, ref as unknown as Record<string, unknown>, token, fetchImpl);
  return json.data.repository.pullRequest.reviews.nodes
    .filter((r) => r.submittedAt !== null && r.author !== null)
    .map((r) => ({
      id: r.id,
      authorLogin: r.author!.login,
      authorIsBot: r.author!.__typename === "Bot",
      state: r.state,
      submittedAt: r.submittedAt as string,
    }));
}

/**
 * Bot detection: GraphQL's real signal is the author's __typename === "Bot"
 * (there is no BOT value in the CommentAuthorAssociation enum — verified live
 * against GitHub's schema; watch-pr.md's REST-derived "author_association is
 * BOT" phrasing doesn't translate directly to GraphQL). The login-suffix
 * check stays as a second, independent signal. NEVER match a bare "-bot"
 * suffix — human usernames can collide (watch-pr.md's own explicit warning).
 */
export function isBotReview(review: BotReview): boolean {
  return review.authorIsBot || review.authorLogin.endsWith("[bot]");
}

async function hasCommitAfter(ref: PrRef, afterIso: string, token: string, fetchImpl: typeof fetch): Promise<boolean> {
  const res = await fetchImpl(`https://api.github.com/repos/${ref.owner}/${ref.repo}/pulls/${ref.number}/commits`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`github rest ${res.status}`);
  const commits = (await res.json()) as Array<{ commit: { author: { date: string } | null } }>;
  return commits.some((c) => c.commit.author && c.commit.author.date > afterIso);
}

export async function dismissPullRequestReviewMutation(
  reviewId: string,
  message: string,
  token: string,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  await graphqlPost(
    `mutation($id: ID!, $msg: String!) { dismissPullRequestReview(input: { pullRequestReviewId: $id, message: $msg }) { pullRequestReview { id } } }`,
    { id: reviewId, msg: message },
    token,
    fetchImpl,
  );
}

export interface DismissResult {
  dismissed: string[];
  skipped: string[];
  failed: Array<{ id: string; error: string }>;
}

/**
 * Orchestrates watch-pr.md §2d: dismiss a bot review iff it requested changes
 * and a fix commit landed after it, continue past an individual mutation
 * failure (log/record, do not abort the whole run).
 */
export async function dismissStaleBotReviews(ref: PrRef, token: string, fetchImpl: typeof fetch = fetch): Promise<DismissResult> {
  const reviews = await fetchReviews(ref, token, fetchImpl);
  const candidates = reviews.filter((r) => r.state === "CHANGES_REQUESTED" && isBotReview(r));

  const result: DismissResult = { dismissed: [], skipped: [], failed: [] };
  for (const r of candidates) {
    const hasFixCommit = await hasCommitAfter(ref, r.submittedAt, token, fetchImpl);
    if (!hasFixCommit) {
      result.skipped.push(r.id);
      continue;
    }
    try {
      await dismissPullRequestReviewMutation(r.id, "Fix commits landed after this review", token, fetchImpl);
      result.dismissed.push(r.id);
    } catch (err) {
      result.failed.push({ id: r.id, error: err instanceof Error ? err.message : String(err) });
    }
  }
  return result;
}
