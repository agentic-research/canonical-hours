import { describe, it, expect } from "vitest";
import {
  ObservationSchema,
  LifecycleEventSchema,
  LifecycleStateSchema,
  LIFECYCLE_SORT_ORDER,
  canonicalPrUri,
} from "../agent/sources/source";

describe("canonicalPrUri", () => {
  it("normalizes case so cross-source merge keys match", () => {
    expect(canonicalPrUri("JamesTexas", "Agents", 42)).toBe("pr:jamestexas/agents#42");
  });
});

describe("schemas", () => {
  const artifact = {
    uri: "pr:o/r#1", kind: "pr", repo: "o/r", number: 1,
    title: "t", url: "https://github.com/o/r/pull/1",
  };
  const observation = {
    artifact_uri: "pr:o/r#1", at: "2026-07-17T00:00:00Z", author: "mark",
    type: "comment", payload: { preview: "hi" }, classification: "hard",
  };

  it("accepts a valid lifecycle event", () => {
    const event = { artifact, observations: [observation], state_hint: "needs_you" };
    expect(LifecycleEventSchema.parse(event)).toEqual(event);
  });

  it("rejects unknown classification", () => {
    expect(() => ObservationSchema.parse({ ...observation, classification: "maybe" })).toThrow();
  });

  it("rejects lifecycle states outside the closed set of four", () => {
    expect(LifecycleStateSchema.safeParse("blocked").success).toBe(false);
  });
});

describe("sort order", () => {
  it("orders needs_you < active < opened < resolved", () => {
    expect(LIFECYCLE_SORT_ORDER.needs_you).toBeLessThan(LIFECYCLE_SORT_ORDER.active);
    expect(LIFECYCLE_SORT_ORDER.active).toBeLessThan(LIFECYCLE_SORT_ORDER.opened);
    expect(LIFECYCLE_SORT_ORDER.opened).toBeLessThan(LIFECYCLE_SORT_ORDER.resolved);
  });
});
