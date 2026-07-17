import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

describe("scaffold", () => {
  it("uses pnpm@10.30.3, ESM, node >= 22", () => {
    expect(pkg.packageManager).toBe("pnpm@10.30.3");
    expect(pkg.type).toBe("module");
    expect(pkg.engines.node).toBe(">=22");
  });

  it("depends on eve, zod, @ai-sdk/anthropic, and the MCP SDK", () => {
    expect(pkg.dependencies.eve).toBeDefined();
    expect(pkg.dependencies.zod).toBeDefined();
    expect(pkg.dependencies["@ai-sdk/anthropic"]).toBeDefined();
    expect(pkg.dependencies["@modelcontextprotocol/sdk"]).toBeDefined();
  });

  it("has the eve agent entrypoint", () => {
    expect(existsSync("agent/agent.ts")).toBe(true);
  });

  it("documents required env vars", () => {
    const env = readFileSync(".env.example", "utf8");
    for (const name of ["LECTIO_URL", "LECTIO_TOKEN", "GITHUB_TOKEN", "ANTHROPIC_API_KEY"]) {
      expect(env).toContain(name);
    }
  });
});
