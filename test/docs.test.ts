import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("agent/instructions.md", () => {
  const md = readFileSync("agent/instructions.md", "utf8");
  it("has the five spec sections", () => {
    for (const h of [
      "## Identity and posture",
      "## Data discipline",
      "## Tick procedure",
      "## Board contract",
      "## Degraded modes",
    ]) {
      expect(md).toContain(h);
    }
  });
  it("locks read-only posture and the empty-result rule", () => {
    expect(md).toMatch(/never post, reply, approve, or comment/);
    expect(md).toMatch(/empty result is a real answer/);
  });
});

describe("agent/skills/pr-board/SKILL.md", () => {
  const md = readFileSync("agent/skills/pr-board/SKILL.md", "utf8");
  it("has frontmatter with a description", () => {
    expect(md.startsWith("---\n")).toBe(true);
    expect(md).toMatch(/\ndescription:/);
  });
  it("names the four lifecycle states and the board tool", () => {
    for (const s of ["opened", "active", "needs_you", "resolved", "`board` tool"]) {
      expect(md).toContain(s);
    }
  });
});
