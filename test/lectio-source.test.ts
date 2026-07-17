import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { LectioSource, classifyLectioKind, normalizeLectioKind } from "../agent/sources/lectio";
import { lectioEnv } from "../agent/connections/lectio";

const activity = JSON.parse(readFileSync("test/fixtures/lectio/authored_activity.json", "utf8"));
const sources = JSON.parse(readFileSync("test/fixtures/lectio/list_sources.json", "utf8"));

const fakeCall = async (tool: string) => {
  if (tool === "memory_authored_activity") return activity;
  if (tool === "memory_list_sources") return sources;
  throw new Error(`unexpected tool ${tool}`);
};

describe("lectioEnv", () => {
  it("throws when LECTIO_URL/LECTIO_TOKEN are missing", () => {
    delete process.env.LECTIO_URL;
    delete process.env.LECTIO_TOKEN;
    expect(() => lectioEnv()).toThrow(/LECTIO_URL/);
  });
});

describe("LectioSource", () => {
  const source = new LectioSource(fakeCall);

  it("is registered under the name 'lectio'", () => {
    expect(source.name).toBe("lectio");
  });

  it("fetch returns raw windowed records", async () => {
    const raws = await source.fetch({
      since: new Date("2026-07-14T08:00:00Z"),
      until: new Date("2026-07-17T08:00:00Z"),
    });
    expect(raws).toHaveLength(1);
  });

  it("maps a record to a lifecycle event with the canonical PR URI", () => {
    const event = source.mapToLifecycleEvent(activity[0]);
    expect(event.artifact.uri).toBe("pr:jamestexas/agents#42");
    expect(event.artifact.kind).toBe("pr");
    expect(event.observations).toHaveLength(2);
    expect(event.observations[0].type).toBe("review_changes_requested");
    expect(event.observations[0].classification).toBe("hard");
    expect(event.observations[1].classification).toBe("soft");
    expect(event.observations[1].payload.preview).toBe("Mark wants a refactor.");
    expect(event.observations[1].payload.lectio_uri).toBe("lectio:obs/2");
  });

  it("classifies derived kinds soft and provider ground truth hard", () => {
    expect(classifyLectioKind("derived/thread_summary")).toBe("soft");
    expect(classifyLectioKind("review_changes_requested")).toBe("hard");
    expect(classifyLectioKind("comment")).toBe("hard");
    expect(classifyLectioKind("unknown_kind")).toBe("soft");
  });

  it("normalizes verdict kind aliases into the canonical vocabulary", () => {
    expect(normalizeLectioKind("changes_requested")).toBe("review_changes_requested");
    expect(normalizeLectioKind("approved")).toBe("review_approved");
    expect(normalizeLectioKind("comment")).toBe("comment");
  });

  it("freshness returns the newest source advance", async () => {
    expect(await source.freshness()).toBe("2026-07-17T06:00:00Z");
  });

  it("fails loudly on malformed records (schema drift)", () => {
    expect(() => source.mapToLifecycleEvent({ nope: true })).toThrow();
  });
});
