import { describe, it, expect, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtemp, cp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Runs the real script (canonical-hours-5d74fc) against a scratch copy of
 * package.json + server.json — never the real repo files, so this can't
 * corrupt them if the script has a bug. */
async function runInScratch(setVersion: string): Promise<{ dir: string; serverJson: string; stdout: string }> {
  const dir = await mkdtemp(join(tmpdir(), "sync-server-json-"));
  const repoRoot = join(__dirname, "..");
  const pkg = JSON.parse(await readFile(join(repoRoot, "package.json"), "utf8"));
  pkg.version = setVersion;
  await cp(join(repoRoot, "server.json"), join(dir, "server.json"));
  const { writeFile } = await import("node:fs/promises");
  await writeFile(join(dir, "package.json"), JSON.stringify(pkg, null, 2));
  const stdout = execFileSync("node", [join(repoRoot, "scripts/sync-server-json-version.mjs")], {
    cwd: dir,
    encoding: "utf8",
  });
  const serverJson = await readFile(join(dir, "server.json"), "utf8");
  return { dir, serverJson, stdout };
}

describe("scripts/sync-server-json-version.mjs", () => {
  const scratchDirs: string[] = [];
  afterEach(async () => {
    await Promise.all(scratchDirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
  });

  it("updates server.json's version to match package.json's, changing nothing else", async () => {
    const original = await readFile(join(__dirname, "..", "server.json"), "utf8");
    const { dir, serverJson, stdout } = await runInScratch("9.9.9-test");
    scratchDirs.push(dir);
    expect(JSON.parse(serverJson).version).toBe("9.9.9-test");
    expect(stdout).toContain("updated to 9.9.9-test");
    // Every other line is byte-identical — only the version value changed.
    const originalLines = original.split("\n");
    const updatedLines = serverJson.split("\n");
    expect(updatedLines).toHaveLength(originalLines.length);
    const differing = originalLines.filter((line, i) => line !== updatedLines[i]);
    expect(differing).toEqual([originalLines.find((l) => l.includes('"version"'))]);
  });

  it("is a no-op when the version already matches", async () => {
    const currentVersion = JSON.parse(
      await readFile(join(__dirname, "..", "package.json"), "utf8"),
    ).version as string;
    const { dir, serverJson, stdout } = await runInScratch(currentVersion);
    scratchDirs.push(dir);
    const original = await readFile(join(__dirname, "..", "server.json"), "utf8");
    expect(serverJson).toBe(original);
    expect(stdout).toContain("nothing to do");
  });
});
