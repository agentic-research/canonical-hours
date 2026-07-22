import { describe, it, expect } from "vitest";
import { sharedSecretGate } from "../agent/lib/action-gate";

describe("sharedSecretGate", () => {
  it("denies every call when no token is configured (default-deny)", async () => {
    const gate = sharedSecretGate(undefined);
    const verdict = await gate({ toolName: "resolve_addressed_review_threads", headers: {} });
    expect(verdict).toEqual({
      allowed: false,
      reason: "MCP_ACTION_TOKEN is not configured — resolve_addressed_review_threads is default-deny until it is set",
    });
  });

  it("denies a call with no Authorization header", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: {} });
    expect(verdict.allowed).toBe(false);
  });

  it("denies a call with a mismatched token", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: { authorization: "Bearer wrong" } });
    expect(verdict.allowed).toBe(false);
  });

  it("denies a malformed Authorization header (missing Bearer prefix)", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: { authorization: "s3cret" } });
    expect(verdict.allowed).toBe(false);
  });

  it("allows a call with the matching bearer token", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: { authorization: "Bearer s3cret" } });
    expect(verdict).toEqual({ allowed: true });
  });

  it("looks up the header case-insensitively", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: { Authorization: "Bearer s3cret" } });
    expect(verdict).toEqual({ allowed: true });
  });

  it("takes the first value when a header arrives as an array", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: { authorization: ["Bearer s3cret"] } });
    expect(verdict).toEqual({ allowed: true });
  });
});
