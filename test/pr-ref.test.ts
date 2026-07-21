import { describe, it, expect } from "vitest";
import { parsePrRef } from "../agent/lib/pr-ref";

describe("parsePrRef", () => {
  it("parses owner/repo#number", () => {
    expect(parsePrRef("jamestexas/agents#42")).toEqual({ owner: "jamestexas", repo: "agents", number: 42 });
  });

  it("parses a github.com PR URL", () => {
    expect(parsePrRef("https://github.com/jamestexas/agents/pull/42")).toEqual({
      owner: "jamestexas",
      repo: "agents",
      number: 42,
    });
  });

  it("parses a github.com PR URL with a trailing slash", () => {
    expect(parsePrRef("https://github.com/jamestexas/agents/pull/42/")).toEqual({
      owner: "jamestexas",
      repo: "agents",
      number: 42,
    });
  });

  it("throws on garbage input", () => {
    expect(() => parsePrRef("not a pr reference")).toThrow(/invalid PR reference/);
  });

  it("throws on a non-PR github URL", () => {
    expect(() => parsePrRef("https://github.com/jamestexas/agents/issues/42")).toThrow(/invalid PR reference/);
  });
});
