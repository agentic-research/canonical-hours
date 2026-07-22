import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { LectioSource, classifyLectioKind, normalizeLectioKind } from "../agent/sources/lectio";

const activity = JSON.parse(readFileSync("test/fixtures/lectio/authored_activity.json", "utf8"));
const sources = JSON.parse(readFileSync("test/fixtures/lectio/list_sources.json", "utf8"));
const firstPr = activity.prs[0];

const fakeCall = async (tool: string) => {
  if (tool === "memory_authored_activity") return activity;
  if (tool === "memory_list_sources") return sources;
  throw new Error(`unexpected tool ${tool}`);
};

describe("LectioSource", () => {
  const source = new LectioSource(fakeCall);

  it("is registered under the name 'lectio'", () => {
    expect(source.name).toBe("lectio");
  });

  it("fetch unwraps the memory_authored_activity envelope's prs[] array", async () => {
    const raws = await source.fetch({
      since: new Date("2026-07-14T08:00:00Z"),
      until: new Date("2026-07-17T08:00:00Z"),
    });
    expect(raws).toHaveLength(1);
    expect(raws[0]).toBe(firstPr);
  });

  it("maps a PR record to a lifecycle event with the canonical PR URI and a synthesized url", () => {
    const event = source.mapToLifecycleEvent(firstPr);
    expect(event.artifact.uri).toBe("pr:jamestexas/agents#42");
    expect(event.artifact.kind).toBe("pr");
    expect(event.artifact.title).toBe("feat: add pr-board skill");
    // lectio's gh adapter never stores a PR url — it's synthesized from repo+number.
    expect(event.artifact.url).toBe("https://github.com/jamestexas/agents/pull/42");
    expect(event.observations).toHaveLength(2);
    expect(event.observations[0].type).toBe("review");
    expect(event.observations[0].classification).toBe("soft");
    expect(event.observations[1].type).toBe("review_comment");
    expect(event.observations[1].classification).toBe("soft");
    expect(event.observations[1].payload.preview).toBe("nit: rename this");
    expect(event.observations[1].payload.lectio_uri).toBe(
      "gh://jamestexas/agents/pr/42/comment/2002",
    );
    // nanos -> ISO round-trip for the review item's observed_at_nanos.
    expect(event.observations[0].at).toBe("2026-07-16T14:00:00.000Z");
  });

  it("never claims needs_you or resolved on its own — at most 'active'", () => {
    const event = source.mapToLifecycleEvent(firstPr);
    expect(event.state_hint).toBe("active");
  });

  it("classifies every lectio kind soft — lectio never carries a verdict", () => {
    expect(classifyLectioKind("github/review")).toBe("soft");
    expect(classifyLectioKind("github/review_comment")).toBe("soft");
    expect(classifyLectioKind("unknown_kind")).toBe("soft");
  });

  it("normalizes lectio's two observed kinds into the local vocabulary", () => {
    expect(normalizeLectioKind("github/review")).toBe("review");
    expect(normalizeLectioKind("github/review_comment")).toBe("review_comment");
    expect(normalizeLectioKind("something_else")).toBe("something_else");
  });

  it("freshness returns the newest source advance", async () => {
    expect(await source.freshness()).toBe("2026-07-17T06:00:00Z");
  });

  it("fails loudly on malformed records (schema drift)", () => {
    expect(() => source.mapToLifecycleEvent({ nope: true })).toThrow();
  });

  it("fails loudly when repo/number can't be resolved", () => {
    expect(() =>
      source.mapToLifecycleEvent({
        uri: "gh://x/pr/1",
        repo: null,
        number: null,
        title: null,
        state: null,
        merged: null,
        new_items: [],
      }),
    ).toThrow(/missing repo\/number/);
  });
});
