import { describe, it, expect } from "vitest";
import { SnapshotSource, SnapshotValue, SnapshotValueSchema } from "../src/snapshot";

const value: SnapshotValue = {
  kind: "fake",
  label: "Fake — Test",
  value: "42",
  detail: "extra context",
  as_of: "2026-07-18T15:00:00Z",
};

/** Fake in-memory implementation — proves the interface is implementable without a provider. */
class FakeSnapshotSource implements SnapshotSource {
  name = "fake";
  async fetch(): Promise<SnapshotValue> {
    return SnapshotValueSchema.parse(value);
  }
  async freshness(): Promise<string | null> {
    return value.as_of;
  }
}

describe("SnapshotValueSchema", () => {
  it("accepts a full value", () => {
    expect(SnapshotValueSchema.parse(value)).toEqual(value);
  });
  it("accepts a value without detail (optional)", () => {
    const { detail: _drop, ...noDetail } = value;
    expect(SnapshotValueSchema.parse(noDetail).detail).toBeUndefined();
  });
  it.each(["kind", "label", "value", "as_of"] as const)("rejects an empty %s", (field) => {
    expect(() => SnapshotValueSchema.parse({ ...value, [field]: "" })).toThrow();
  });
});

describe("SnapshotSource", () => {
  it("a fake in-memory implementation satisfies the interface", async () => {
    const source: SnapshotSource = new FakeSnapshotSource();
    expect(source.name).toBe("fake");
    expect(await source.fetch()).toEqual(value);
    expect(await source.freshness()).toBe(value.as_of);
  });
});
