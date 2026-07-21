import { describe, it, expect } from "vitest";
import {
  ObservationSchema,
  LifecycleEventSchema,
  LifecycleStateSchema,
  LIFECYCLE_SORT_ORDER,
  ArtifactSchema,
  canonicalPrUri,
  canonicalIssueUri,
} from "../agent/sources/source";

describe("canonicalPrUri", () => {
  it("normalizes case so cross-source merge keys match", () => {
    expect(canonicalPrUri("JamesTexas", "Agents", 42)).toBe("pr:jamestexas/agents#42");
  });
});

describe("schemas", () => {
  const prArtifact = {
    uri: "pr:o/r#1", kind: "pr", repo: "o/r", number: 1,
    title: "t", url: "https://github.com/o/r/pull/1",
  };
  const issueArtifact = {
    uri: "issue:art/art-123", kind: "issue", team: "ART", identifier: "ART-123",
    title: "t", url: "https://linear.app/team/issue/ART-123",
  };
  const observation = {
    artifact_uri: "pr:o/r#1", at: "2026-07-17T00:00:00Z", author: "mark",
    type: "comment", payload: { preview: "hi" }, classification: "hard",
  };

  it("accepts a valid pr lifecycle event", () => {
    const event = { artifact: prArtifact, observations: [observation], state_hint: "needs_you" };
    expect(LifecycleEventSchema.parse(event)).toEqual(event);
  });

  it("accepts a valid issue lifecycle event", () => {
    const event = { artifact: issueArtifact, observations: [], state_hint: "needs_you" };
    expect(LifecycleEventSchema.parse(event)).toEqual(event);
  });

  it("rejects a pr artifact missing repo/number", () => {
    const { repo: _repo, number: _number, ...bad } = prArtifact;
    expect(() => ArtifactSchema.parse(bad)).toThrow();
  });

  it("rejects an issue artifact missing team/identifier", () => {
    const { team: _team, identifier: _identifier, ...bad } = issueArtifact;
    expect(() => ArtifactSchema.parse(bad)).toThrow();
  });

  it("rejects an unknown kind", () => {
    expect(() => ArtifactSchema.parse({ ...prArtifact, kind: "epic" })).toThrow();
  });

  it("rejects unknown classification", () => {
    expect(() => ObservationSchema.parse({ ...observation, classification: "maybe" })).toThrow();
  });

  it("rejects lifecycle states outside the closed set of four", () => {
    expect(LifecycleStateSchema.safeParse("blocked").success).toBe(false);
  });
});

describe("canonicalIssueUri", () => {
  it("normalizes case so cross-source merge keys match", () => {
    expect(canonicalIssueUri("ART", "ART-123")).toBe("issue:art/art-123");
  });
});

describe("sort order", () => {
  it("orders needs_you < active < opened < resolved", () => {
    expect(LIFECYCLE_SORT_ORDER.needs_you).toBeLessThan(LIFECYCLE_SORT_ORDER.active);
    expect(LIFECYCLE_SORT_ORDER.active).toBeLessThan(LIFECYCLE_SORT_ORDER.opened);
    expect(LIFECYCLE_SORT_ORDER.opened).toBeLessThan(LIFECYCLE_SORT_ORDER.resolved);
  });
});
