import { readFileSync } from "node:fs";
import { parse } from "@iarna/toml";
import { Config, parseConfig } from "@vespers/core";

export type { Config };

/**
 * Synchronous by design: agent/schedules/pr-board.ts consumes this at module
 * load, where defineSchedule needs the cron string.
 *
 * File missing → full defaults (5-minute cron, no [weather] → the weather
 * source is simply not registered; not a degradation — absence of optional
 * config is a valid state). File present but malformed (bad TOML or
 * zod-invalid) → throw at module load: a loud build/boot failure. Runtime
 * data failures degrade; config failures are deploy-time bugs and should
 * fail the deploy. Cron validity beyond non-emptiness is delegated to eve's
 * defineSchedule, which owns cron semantics.
 *
 * The file-reading + TOML-parsing here is the one Node-filesystem-specific
 * part of config loading; the actual shape validation lives in
 * @vespers/core's parseConfig so it's testable/reusable without a
 * filesystem (canonical-hours-35893f).
 */
export function loadConfig(path = "canonical-hours.toml"): Config {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return parseConfig({});
    }
    throw err;
  }
  return parseConfig(parse(raw));
}
