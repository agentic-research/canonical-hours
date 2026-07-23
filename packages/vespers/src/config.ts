import { z } from "zod";

export const ConfigSchema = z.object({
  schedule: z.object({ cron: z.string().min(1) }).default({ cron: "*/5 * * * *" }),
  weather: z.object({ location: z.string().min(1) }).optional(),
  github: z.object({ min_remaining: z.number().int().positive() }).default({ min_remaining: 200 }),
  linear: z
    .object({
      team: z.string().min(1),
      user_email: z.string().min(1),
      triage_stale_days: z.number().int().positive().default(7),
      triage_abandoned_days: z.number().int().positive().default(30),
      todo_stale_days: z.number().int().positive().default(30),
    })
    .optional(),
});
export type Config = z.infer<typeof ConfigSchema>;

/**
 * Parses an already-read TOML string into a validated Config. No file I/O —
 * that's canonical-hours' own agent/lib/config.ts's job (readFileSync +
 * ENOENT-means-defaults), kept out of this package because workerd has no
 * filesystem. A malformed config throws (zod-invalid or bad TOML syntax
 * from the caller's own `parse()` call) — a loud, deploy-time failure by
 * design, not a degradation.
 */
export function parseConfig(parsed: unknown): Config {
  return ConfigSchema.parse(parsed);
}
