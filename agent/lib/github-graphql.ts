/**
 * Stateless GraphQL POST + error-array check, shared by the two new one-off
 * action-tool libraries (thread-resolution.ts, bot-review-dismissal.ts).
 * Deliberately NOT used by agent/sources/github.ts's GithubSource.graphqlRequest,
 * which carries rate-limit backoff state (this.minRemaining/sleepImpl/now) this
 * helper has no equivalent for — the two are solving different problems.
 */
export async function graphqlPost<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string,
  fetchImpl: typeof fetch = fetch,
): Promise<T> {
  const res = await fetchImpl("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`github graphql ${res.status}`);
  const json = (await res.json()) as T & { errors?: Array<{ message: string }> };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json;
}
