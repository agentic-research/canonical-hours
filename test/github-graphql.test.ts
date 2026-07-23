import { describe, it, expect } from "vitest";
import { graphqlPost } from "../agent/lib/github-graphql";

describe("graphqlPost", () => {
  it("POSTs to the GitHub GraphQL endpoint with the query and variables, returns parsed JSON", async () => {
    let captured: { url: string; body: unknown } | undefined;
    const fetchImpl = (async (url: RequestInfo | URL, init?: RequestInit) => {
      captured = { url: url.toString(), body: JSON.parse(String(init?.body)) };
      return new Response(JSON.stringify({ data: { ok: true } }), { status: 200 });
    }) as typeof fetch;
    const result = await graphqlPost<{ data: { ok: boolean } }>("query { x }", { a: 1 }, "tok", fetchImpl);
    expect(captured!.url).toBe("https://api.github.com/graphql");
    expect(captured!.body).toEqual({ query: "query { x }", variables: { a: 1 } });
    expect(result).toEqual({ data: { ok: true } });
  });

  it("throws on a non-ok HTTP response", async () => {
    const fetchImpl = (async () => new Response("", { status: 500 })) as typeof fetch;
    await expect(graphqlPost("query { x }", {}, "tok", fetchImpl)).rejects.toThrow(/github graphql 500/);
  });

  it("throws on a GraphQL error array even with a 200 status", async () => {
    const fetchImpl = (async () =>
      new Response(JSON.stringify({ errors: [{ message: "field not found" }] }), { status: 200 })) as typeof fetch;
    await expect(graphqlPost("query { x }", {}, "tok", fetchImpl)).rejects.toThrow(/field not found/);
  });
});
