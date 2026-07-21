import { readFileSync } from "node:fs";
import { parse } from "@iarna/toml";
import { z } from "zod";

const ConfigSchema = z.object({
  schedule: z.object({ cron: z.string().min(1) }).default({ cron: "*/5 * * * *" }),
  weather: z.object({ location: z.string().min(1) }).optional(),
  github: z.object({ min_remaining: z.number().int().positive() }).default({ min_remaining: 200 }),
});
export type Config = z.infer<typeof ConfigSchema>;

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
 */
export function loadConfig(path = "canonical-hours.toml"): Config {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return ConfigSchema.parse({});
    }
    throw err;
  }
  return ConfigSchema.parse(parse(raw));
}
