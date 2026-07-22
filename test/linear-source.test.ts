// test/linear-source.test.ts
import { describe, it, expect } from "vitest";
import { LinearSource } from "../agent/lib/sources/linear";

function fakeFetch(response: unknown): typeof fetch {
  return (async () => new Response(JSON.stringify(response), { status: 200 })) as typeof fetch;
}

const staleness = { triageStaleDays: 7, triageAbandonedDays: 30, todoStaleDays: 30 };
const NOW = new Date("2026-07-21T12:00:00Z");
const now = () => NOW;
const window = { since: new Date("2026-07-14T12:00:00Z"), until: NOW };

function issueNode(overrides: Partial<{
  identifier: string; title: string; url: string; priority: number;
  createdAt: string; updatedAt: string; team: string; stateName: string; stateType: string;
}> = {}) {
  return {
    identifier: overrides.identifier ?? "ART-1",
    title: overrides.title ?? "A ticket",
    url: overrides.url ?? "https://linear.app/team/issue/ART-1",
    priority: overrides.priority ?? 3,
    createdAt: overrides.createdAt ?? "2026-07-20T12:00:00Z",
    updatedAt: overrides.updatedAt ?? "2026-07-20T12:00:00Z",
    team: { key: overrides.team ?? "ART" },
    state: { name: overrides.stateName ?? "Triage", type: overrides.stateType ?? "triage" },
  };
}

function gqlResponse(nodes: ReturnType<typeof issueNode>[]) {
  return { data: { issues: { nodes } } };
}

describe("LinearSource", () => {
  it("is registered under the name 'linear'", () => {
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([])));
    expect(source.name).toBe("linear");
  });

  it("uses a raw (non-Bearer) Authorization header", async () => {
    let capturedHeaders: HeadersInit | undefined;
    const fetchImpl = (async (_url: RequestInfo | URL, init?: RequestInit) => {
      capturedHeaders = init?.headers;
      return new Response(JSON.stringify(gqlResponse([])), { status: 200 });
    }) as typeof fetch;
    const source = new LinearSource("lin_api_abc123", "me@example.com", staleness, fetchImpl);
    await source.fetch(window);
    expect((capturedHeaders as Record<string, string>).Authorization).toBe("lin_api_abc123");
  });

  it("fetch maps GraphQL nodes to flat raw records", async () => {
    const source = new LinearSource(
      "key", "me@example.com", staleness,
      fakeFetch(gqlResponse([issueNode({ identifier: "ART-1", priority: 2, stateType: "triage" })])),
    );
    const raws = (await source.fetch(window)) as Array<{ identifier: string; priority: number; team: string; stateType: string }>;
    expect(raws).toEqual([
      expect.objectContaining({ identifier: "ART-1", priority: 2, team: "ART", stateType: "triage" }),
    ]);
  });

  it("P1/P2 in Triage > triageStaleDays sets needs_you with a specific reason", async () => {
    const node = issueNode({ priority: 1, stateType: "triage", createdAt: "2026-07-12T12:00:00Z" }); // 9 days old
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([node])), now);
    const raws = await source.fetch(window);
    const event = source.mapToLifecycleEvent(raws[0]);
    expect(event.state_hint).toBe("needs_you");
    expect(event.extra?.reason).toBe("P1 stuck in Triage for 9d");
  });

  it("P1/P2 in Todo (unstarted) sets needs_you unconditionally, even same-day", async () => {
    const node = issueNode({ priority: 2, stateType: "unstarted", createdAt: "2026-07-21T11:00:00Z", updatedAt: "2026-07-21T11:00:00Z" });
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([node])), now);
    const raws = await source.fetch(window);
    const event = source.mapToLifecycleEvent(raws[0]);
    expect(event.state_hint).toBe("needs_you");
    expect(event.extra?.reason).toBe("P2 in Todo, not started");
  });

  it("any priority in Triage > triageAbandonedDays sets needs_you", async () => {
    const node = issueNode({ priority: 4, stateType: "triage", createdAt: "2026-06-01T12:00:00Z" }); // >30 days old
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([node])), now);
    const raws = await source.fetch(window);
    const event = source.mapToLifecycleEvent(raws[0]);
    expect(event.state_hint).toBe("needs_you");
    expect(event.extra?.reason).toContain("still ours?");
  });

  it("any priority in Todo untouched > todoStaleDays sets needs_you", async () => {
    const node = issueNode({ priority: 4, stateType: "unstarted", createdAt: "2026-05-01T12:00:00Z", updatedAt: "2026-06-01T12:00:00Z" }); // updatedAt >30 days ago
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([node])), now);
    const raws = await source.fetch(window);
    const event = source.mapToLifecycleEvent(raws[0]);
    expect(event.state_hint).toBe("needs_you");
    expect(event.extra?.reason).toContain("done elsewhere?");
  });

  it("a clean issue (low priority, fresh Triage) fires no hint and no reason", async () => {
    const node = issueNode({ priority: 3, stateType: "triage", createdAt: "2026-07-20T12:00:00Z" }); // 1 day old
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([node])), now);
    const raws = await source.fetch(window);
    const event = source.mapToLifecycleEvent(raws[0]);
    expect(event.state_hint).toBeUndefined();
    expect(event.extra).toBeUndefined();
  });

  it("a completed issue emits a hard close observation, no staleness hint", async () => {
    const node = issueNode({ stateType: "completed", updatedAt: "2026-07-21T10:00:00Z" });
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([node])), now);
    const raws = await source.fetch(window);
    const event = source.mapToLifecycleEvent(raws[0]);
    expect(event.observations).toEqual([
      { artifact_uri: "issue:art/art-1", at: "2026-07-21T10:00:00Z", author: "", type: "close", payload: {}, classification: "hard" },
    ]);
    expect(event.state_hint).toBeUndefined();
  });

  it("a canceled issue also emits a hard close observation", async () => {
    const node = issueNode({ stateType: "canceled", updatedAt: "2026-07-21T10:00:00Z" });
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([node])), now);
    const raws = await source.fetch(window);
    const event = source.mapToLifecycleEvent(raws[0]);
    expect(event.observations.some((o) => o.type === "close")).toBe(true);
  });

  it("mapToLifecycleEvent produces a correctly-shaped issue artifact", async () => {
    const node = issueNode({ identifier: "ART-42", title: "Fix the thing", url: "https://linear.app/team/issue/ART-42", team: "ART" });
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([node])), now);
    const raws = await source.fetch(window);
    const event = source.mapToLifecycleEvent(raws[0]);
    expect(event.artifact).toEqual({
      uri: "issue:art/art-42", kind: "issue", team: "ART", identifier: "ART-42",
      title: "Fix the thing", url: "https://linear.app/team/issue/ART-42",
    });
  });

  it("fails loudly on malformed records", () => {
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([])));
    expect(() => source.mapToLifecycleEvent({ nope: true })).toThrow();
  });

  it("throws on a non-ok HTTP response", async () => {
    const fetchImpl = (async () => new Response("", { status: 500 })) as typeof fetch;
    const source = new LinearSource("key", "me@example.com", staleness, fetchImpl);
    await expect(source.fetch(window)).rejects.toThrow(/linear graphql 500/);
  });

  it("throws on a GraphQL error response", async () => {
    const fetchImpl = (async () =>
      new Response(JSON.stringify({ errors: [{ message: "invalid filter" }] }), { status: 200 })) as typeof fetch;
    const source = new LinearSource("key", "me@example.com", staleness, fetchImpl);
    await expect(source.fetch(window)).rejects.toThrow(/invalid filter/);
  });

  it("freshness returns the current time", async () => {
    const source = new LinearSource("key", "me@example.com", staleness, fakeFetch(gqlResponse([])), now);
    expect(await source.freshness()).toBe(NOW.toISOString());
  });
});
