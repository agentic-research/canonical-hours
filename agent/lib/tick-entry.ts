import { lectioEnv } from "../connections/lectio";
import { GithubSource } from "../sources/github";
import { LectioSource, createMcpLectioCall } from "../sources/lectio";
import type { SnapshotSource } from "@canonical-hours/core";
import { WeatherSource } from "../sources/weather";
import { loadConfig } from "./config";
import { runTick, TickResult } from "./tick";
import { createInvokeAgent, InvokeAgentRuntime } from "./invoke-agent";

// Module-load config, like pr-board.ts: a malformed canonical-hours.toml
// fails the boot loudly rather than running at a cadence nobody chose.
const config = loadConfig();

// The snapshot registry, mirroring the activity `sources` array below:
// a second snapshot source is one entry here, not a rewrite. No [weather]
// table in the TOML → the source is simply not registered (no degradation).
const snapshotSources: SnapshotSource[] = [];
if (config.weather) {
  snapshotSources.push(
    // WEATHER_API_KEY is env-only (secret — same handling as GITHUB_TOKEN);
    // empty key → fetch() throws → a visible `weather` degradation, never a crash.
    new WeatherSource(process.env.WEATHER_API_KEY ?? "", config.weather.location),
  );
}

/**
 * The scheduled tick, fully wired.
 *
 * Takes the schedule handler's `{ receive, appAuth }` (a subset of
 * `ScheduleHandlerArgs` — see invoke-agent.ts's `InvokeAgentRuntime` for why
 * this can't be a bare zero-arg function: `receive`/`appAuth` only exist
 * inside `agent/schedules/pr-board.ts`'s `run(...)` callback, per
 * docs/eve-api-notes.md fact 2).
 */
export async function prBoardTick(runtime: InvokeAgentRuntime): Promise<TickResult> {
  const { url, token } = lectioEnv();
  const result = await runTick({
    sources: [
      new LectioSource(createMcpLectioCall(url, token)),
      new GithubSource(process.env.GITHUB_TOKEN ?? "", fetch, () => new Date(), config.github.min_remaining),
    ],
    priority: ["lectio", "github"],
    snapshotSources,
    invokeAgent: createInvokeAgent(runtime),
  });
  console.log(`[pr-board] tick result: ${result}`);
  return result;
}
