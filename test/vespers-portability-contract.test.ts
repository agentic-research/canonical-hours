import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC_ROOT = join(process.cwd(), "packages/vespers/src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return sourceFiles(path);
    return path.endsWith(".ts") ? [path] : [];
  });
}

describe("@agentic-research/vespers-core portability contract", () => {
  it("does not import Node builtins or read process.env", () => {
    const offenders = sourceFiles(SRC_ROOT)
      .map((path) => {
        const text = readFileSync(path, "utf8");
        const hits = [
          ...text.matchAll(/from\s+["']node:[^"']+["']/g),
          ...text.matchAll(/\bprocess\.env\b/g),
        ].map((match) => match[0]);
        return { path: relative(process.cwd(), path), hits };
      })
      .filter((entry) => entry.hits.length > 0);

    expect(offenders).toEqual([]);
  });
});
