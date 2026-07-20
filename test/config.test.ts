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
});
