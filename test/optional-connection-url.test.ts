import { describe, it, expect } from "vitest";
import { optionalConnectionUrl } from "../agent/lib/optional-connection-url";

describe("optionalConnectionUrl", () => {
  it("passes through a real configured URL unchanged", () => {
    expect(optionalConnectionUrl("https://lectio.example.com/mcp")).toBe("https://lectio.example.com/mcp");
  });

  it("substitutes a syntactically-valid placeholder when undefined", () => {
    const url = optionalConnectionUrl(undefined);
    expect(() => new URL(url)).not.toThrow();
  });

  it("substitutes a syntactically-valid placeholder when empty string", () => {
    const url = optionalConnectionUrl("");
    expect(() => new URL(url)).not.toThrow();
  });
});
