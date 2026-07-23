import { GithubSource } from "./sources/github";
import { LectioSource, createMcpLectioCall } from "./sources/lectio";
import { LinearSource } from "./sources/linear";
import type { SnapshotSource, Source } from "@agentic-research/vespers-core";
import { runTick, TickResult } from "@agentic-research/vespers-core";
import { WeatherSource } from "./sources/weather";
import { loadConfig } from "./config";
import { loadPrivateSources } from "./private-sources";
import { nodeBoardStore } from "./node-board-store";
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

// The activity source registry: a fourth pluggable source is one entry here
// (plus a config table), not a rewrite. No [linear] table → LinearSource is
// simply not registered — same "absence is a valid state" convention as weather.
// LECTIO_URL/LECTIO_TOKEN empty-string fallback matches GITHUB_TOKEN/WEATHER_API_KEY/
// LINEAR_API_KEY exactly: never throws here, only inside fetch() (createMcpLectioCall's
// `new URL("")` throws lazily on first use), where runTick's per-source try/catch turns
// it into a `lectio` degradation instead of crashing the whole tick.
const sources: Source[] = [
  new LectioSource(createMcpLectioCall(process.env.LECTIO_URL ?? "", process.env.LECTIO_TOKEN ?? "")),
  new GithubSource(process.env.GITHUB_TOKEN ?? "", fetch, () => new Date(), config.github.min_remaining),
];
if (config.linear) {
  sources.push(
    // LINEAR_API_KEY is env-only (secret — same handling as GITHUB_TOKEN/WEATHER_API_KEY).
    new LinearSource(process.env.LINEAR_API_KEY ?? "", config.linear.user_email, {
      triageStaleDays: config.linear.triage_stale_days,
      triageAbandonedDays: config.linear.triage_abandoned_days,
      todoStaleDays: config.linear.todo_stale_days,
    }),
  );
}

// Optional private sources (canonical-hours-dfb779) — see private-sources.ts.
sources.push(...(await loadPrivateSources(process.env.CANONICAL_HOURS_PRIVATE_SOURCES_PATH)));

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
  const result = await runTick({
    sources,
    priority: ["lectio", "github", "linear"],
    snapshotSources,
    boardStore: nodeBoardStore,
    invokeAgent: createInvokeAgent(runtime),
  });
  console.log(`[pr-board] tick result: ${result}`);
  return result;
}
