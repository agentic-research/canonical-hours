import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("agent definition", () => {
  const src = readFileSync("agent/agent.ts", "utf8");

  it("uses the direct Anthropic provider with Haiku (no AI Gateway)", () => {
    expect(src).toContain('from "@ai-sdk/anthropic"');
    expect(src).toContain('anthropic("claude-haiku-4-5")');
  });

  it("does not configure a Postgres workflow world (default local/file, spec A1)", () => {
    expect(src).not.toMatch(/postgres/i);
    expect(src).not.toMatch(/workflow\.world/);
  });

  it("module loads without ANTHROPIC_API_KEY set (key is read at call time)", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const mod = await import("../agent/agent");
    expect(mod.default).toBeDefined();
  });
});

describe("sandbox selection", () => {
  it("selects by SANDBOX_BACKEND env, never hardcoded", () => {
    const sandboxSrc = readFileSync("agent/sandbox.ts", "utf8");
    expect(sandboxSrc).toContain("SANDBOX_BACKEND");
    expect(sandboxSrc).toContain("defaultBackend");
  });
});
