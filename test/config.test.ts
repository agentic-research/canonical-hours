import { describe, it, expect } from "vitest";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Config, loadConfig } from "../agent/lib/config";

describe("loadConfig", () => {
  it("missing file → full defaults: 5-minute cron, no weather (weather source simply not registered)", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const config: Config = loadConfig(join(dir, "does-not-exist.toml"));
    expect(config.schedule.cron).toBe("*/5 * * * *");
    expect(config.weather).toBeUndefined();
  });

  it("valid file → parsed cron and weather location", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const path = join(dir, "canonical-hours.toml");
    await writeFile(path, '[schedule]\ncron = "0 * * * *"\n\n[weather]\nlocation = "Lisbon"\n', "utf8");
    const config = loadConfig(path);
    expect(config.schedule.cron).toBe("0 * * * *");
    expect(config.weather?.location).toBe("Lisbon");
  });

  it("parses the committed canonical-hours.toml at the repo root (default path)", () => {
    // This is the value defineSchedule and WeatherSource actually receive (asserted at the loadConfig boundary).
    const config = loadConfig();
    expect(config.schedule.cron).toBe("*/5 * * * *");
    expect(config.weather?.location).toBe("Austin, TX");
  });

  it("malformed TOML → throws (loud deploy-time failure, never a silent fallback cadence)", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const path = join(dir, "bad.toml");
    await writeFile(path, "[schedule\ncron =", "utf8");
    expect(() => loadConfig(path)).toThrow();
  });

  it("zod-invalid config (empty cron) → throws", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const path = join(dir, "empty-cron.toml");
    await writeFile(path, '[schedule]\ncron = ""\n', "utf8");
    expect(() => loadConfig(path)).toThrow();
  });

  it("missing [github] table → min_remaining defaults to 200", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const config: Config = loadConfig(join(dir, "does-not-exist.toml"));
    expect(config.github.min_remaining).toBe(200);
  });

  it("[github] table present → parsed min_remaining", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const path = join(dir, "canonical-hours.toml");
    await writeFile(path, '[github]\nmin_remaining = 500\n', "utf8");
    const config = loadConfig(path);
    expect(config.github.min_remaining).toBe(500);
  });

  it("zod-invalid config (non-positive min_remaining) → throws", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const path = join(dir, "bad-github.toml");
    await writeFile(path, '[github]\nmin_remaining = 0\n', "utf8");
    expect(() => loadConfig(path)).toThrow();
  });

  it("missing [linear] table → linear is undefined (feature off, no error)", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const config: Config = loadConfig(join(dir, "does-not-exist.toml"));
    expect(config.linear).toBeUndefined();
  });

  it("[linear] table present → parsed team/user_email, defaulted thresholds", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const path = join(dir, "canonical-hours.toml");
    await writeFile(path, '[linear]\nteam = "ART"\nuser_email = "you@example.com"\n', "utf8");
    const config = loadConfig(path);
    expect(config.linear).toEqual({
      team: "ART",
      user_email: "you@example.com",
      triage_stale_days: 7,
      triage_abandoned_days: 30,
      todo_stale_days: 30,
    });
  });

  it("[linear] table can override the day thresholds", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const path = join(dir, "canonical-hours.toml");
    await writeFile(
      path,
      '[linear]\nteam = "ART"\nuser_email = "you@example.com"\ntriage_stale_days = 3\n',
      "utf8",
    );
    const config = loadConfig(path);
    expect(config.linear?.triage_stale_days).toBe(3);
    expect(config.linear?.triage_abandoned_days).toBe(30); // still defaulted
  });

  it("[linear] table present but missing team → throws", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const path = join(dir, "canonical-hours.toml");
    await writeFile(path, '[linear]\nuser_email = "you@example.com"\n', "utf8");
    expect(() => loadConfig(path)).toThrow();
  });

  it("[linear] table present but missing user_email → throws", async () => {
    const dir = await mkdtemp(join(tmpdir(), "config-"));
    const path = join(dir, "canonical-hours.toml");
    await writeFile(path, '[linear]\nteam = "ART"\n', "utf8");
    expect(() => loadConfig(path)).toThrow();
  });
});
