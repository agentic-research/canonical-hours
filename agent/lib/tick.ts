import { createHash } from "node:crypto";
import { FetchWindow, LifecycleEvent, Source } from "../sources/source";
import { MergedArtifact, mergeEvents } from "../sources/merge";
import { SnapshotSource, SnapshotValue } from "../sources/snapshot";
import { Board, readBoard, writeBoardAtomic } from "./board";
import { AgentTickInput } from "./invoke-agent";

export interface TickDeps {
  sources: Source[];
  priority: string[]; // ["lectio", "github"]
  now?: () => Date;
  windowHours?: number; // default 72
  quietHours?: string; // e.g. "22-07" (optional config knob, spec §2.2)
  quietTz?: string; // IANA tz, default "UTC"
  /** Runs the Haiku agent over material; the agent writes via the board tool itself. */
  invokeAgent: (input: AgentTickInput) => Promise<void>;
  boardDir?: string;
  /** Current-value sources (no lifecycle, no window, no LLM). Default []. */
  snapshotSources?: SnapshotSource[];
}

export type TickResult =
  | "skipped_overlap"
  | "skipped_quiet"
  | "all_clear"
  | "material_unchanged"
  | "material"
  | "degraded_fallback";

let running = false;

export function _resetTickGuardForTests(): void {
  running = false;
}

export function inQuietHours(now: Date, spec: string | undefined, tz: string): boolean {
  if (!spec) return false;
  const m = /^(\d{1,2})-(\d{1,2})$/.exec(spec);
  if (!m) return false;
  const [start, end] = [Number(m[1]), Number(m[2])];
  const hour =
    Number(
      new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: tz }).format(now),
    ) % 24;
  return start <= end ? hour >= start && hour < end : hour >= start || hour < end;
}

export function toBoardPr(m: MergedArtifact): Board["prs"][number] {
  const reason = {
    needs_you: "unanswered review/comment or standing changes_requested",
    active: "others engaged; nothing outstanding on you",
    opened: "no activity from others yet",
    resolved: "merged, closed, or fully answered",
  }[m.state];
  return {
    artifact_uri: m.artifact.uri,
    repo: m.artifact.repo,
    number: m.artifact.number,
    title: m.artifact.title,
    url: m.artifact.url,
    state: m.state,
    reason,
    new_items: m.observations.slice(-5).map((o) => ({
      type: o.type,
      author: o.author,
      preview: String(o.payload.preview ?? ""),
      at: o.at,
      uri:
        typeof o.payload.url === "string" && o.payload.url
          ? o.payload.url
          : typeof o.payload.lectio_uri === "string" && o.payload.lectio_uri
            ? o.payload.lectio_uri
            : undefined,
      classification: o.classification,
    })),
  };
}

/**
 * Identity of the material set: for each material artifact, its URI, state,
 * and the full identity of its observation set (not just the latest
 * timestamp — the tick is stateless and re-fetches the whole window every
 * time, so a new observation is not guaranteed to advance the max timestamp;
 * hashing only the max would silently miss a backfilled/out-of-order/
 * same-second observation and skip a real re-summarization). Sensitive to
 * exactly what should re-invoke the LLM: a new material PR, a state flip, a
 * PR leaving the set, or any change to a material PR's observation set —
 * added, removed, or reordered. Insensitive to non-material churn and fetch
 * order.
 */
export function computeMaterialHash(material: MergedArtifact[]): string {
  const tuples: [string, string, string][] = material.map((m) => {
    const obsIdentity = m.observations
      .map((o) => `${o.at}|${o.type}`)
      .sort()
      .join(",");
    return [m.artifact.uri, m.state, obsIdentity];
  });
  tuples.sort((a, b) => a[0].localeCompare(b[0]));
  return createHash("sha256").update(JSON.stringify(tuples)).digest("hex");
}

/**
 * One tick, end to end (spec §2.3). Overlap-guarded via the module-level
 * `running` flag; never throws out of here.
 *
 * The overlap guard is what makes Task 6's accepted writer-vs-writer race
 * in writeBoardAtomic (concurrent calls colliding on a shared temp filename)
 * safe in practice: as long as this flag genuinely serializes runTick calls
 * within a process, two writeBoardAtomic calls for the same tick can never
 * be in flight concurrently. Verified by the "overlap guard" test in
 * test/tick.test.ts, which races two runTick() calls against the same
 * module instance and asserts the second is rejected before either one's
 * writeBoardAtomic call happens.
 */
export async function runTick(deps: TickDeps): Promise<TickResult> {
  if (running) return "skipped_overlap";
  running = true;
  try {
    return await runTickInner(deps);
  } finally {
    running = false;
  }
}

async function runTickInner(deps: TickDeps): Promise<TickResult> {
  const now = (deps.now ?? (() => new Date()))();
  const quietSpec = deps.quietHours ?? process.env.QUIET_HOURS;
  const quietTz = deps.quietTz ?? process.env.QUIET_TZ ?? "UTC";
  if (inQuietHours(now, quietSpec, quietTz)) return "skipped_quiet";

  const windowHours = deps.windowHours ?? 72;
  const window: FetchWindow = {
    since: new Date(now.getTime() - windowHours * 3600_000),
    until: now,
  };
  const boardWindow = { since: window.since.toISOString(), until: window.until.toISOString() };

  const previous = await readBoard(deps.boardDir);
  const degradations: Board["degradations"] = [];
  const freshness: Board["freshness"] = [];
  const eventsBySource: Record<string, LifecycleEvent[]> = {};

  // Sources run independently; one failing doesn't stop the others (spec §2.4).
  for (const source of deps.sources) {
    try {
      const raws = await source.fetch(window);
      // Adapters zod-parse at their own boundary; drift throws here → degradation.
      eventsBySource[source.name] = raws.map((raw) => source.mapToLifecycleEvent(raw));
    } catch (err) {
      const prior = previous?.degradations.find((d) => d.source === source.name);
      degradations.push({
        source: source.name,
        error: err instanceof Error ? err.message : String(err),
        since: prior?.since ?? now.toISOString(),
      });
    }
    try {
      freshness.push({ source: source.name, last_advanced_at: await source.freshness() });
    } catch {
      freshness.push({ source: source.name, last_advanced_at: null });
    }
  }

  // Snapshot sources: fetched deterministically on every tick, attached to
  // whichever board gets written, entirely outside the LLM path. A snapshot
  // source that seems to need summarization is not a snapshot source.
  const snapshots: SnapshotValue[] = [];
  for (const source of deps.snapshotSources ?? []) {
    try {
      snapshots.push(await source.fetch());
    } catch (err) {
      const prior = previous?.degradations.find((d) => d.source === source.name);
      degradations.push({
        source: source.name,
        error: err instanceof Error ? err.message : String(err),
        since: prior?.since ?? now.toISOString(),
      });
    }
    try {
      freshness.push({ source: source.name, last_advanced_at: await source.freshness() });
    } catch {
      freshness.push({ source: source.name, last_advanced_at: null });
    }
  }

  const merged = mergeEvents(eventsBySource, deps.priority);
  const material = merged.filter((m) => m.state === "needs_you" || m.state === "active");
  const materialHash = computeMaterialHash(material);

  if (material.length === 0) {
    // All-clear (or all-degraded) path: templated board, zero LLM tokens.
    const board: Board = {
      generated_at: now.toISOString(),
      tick_status: degradations.length > 0 ? "degraded" : "all_clear",
      window: boardWindow,
      freshness,
      degradations,
      prs: merged.map(toBoardPr),
      snapshots,
      material_hash: materialHash,
    };
    await writeBoardAtomic(board, deps.boardDir);
    return "all_clear";
  }

  // Three-way outcome: if the material set is byte-identical to the last written
  // board's, re-summarizing it is not worth an LLM call. Guard: a previous
  // agent-fallback board (degradations entry with source "agent") never
  // short-circuits — the agent is retried so summaries recover after an outage.
  const previousWasAgentFallback =
    previous?.degradations.some((d) => d.source === "agent") ?? false;
  if (previous?.material_hash === materialHash && !previousWasAgentFallback) {
    const previousSummaries = new Map(
      previous.prs.map((p) => [p.artifact_uri, p.summary] as const),
    );
    const board: Board = {
      generated_at: now.toISOString(), // fresh — the staleness health check keeps working
      tick_status: degradations.length > 0 ? "degraded" : "ok",
      window: boardWindow,
      freshness,
      degradations,
      // Deterministic fields (reason, new_items, state) from THIS tick's own fold;
      // only the LLM's prose (summary) is reused, keyed by artifact_uri.
      prs: merged.map((m) => ({
        ...toBoardPr(m),
        summary: previousSummaries.get(m.artifact.uri),
      })),
      snapshots,
      material_hash: materialHash,
    };
    await writeBoardAtomic(board, deps.boardDir);
    return "material_unchanged";
  }

  // Material path: agent triages/summarizes and writes via the board tool.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await deps.invokeAgent({ merged, freshness, degradations, window: boardWindow });
      const written = await readBoard(deps.boardDir);
      if (written && written.generated_at >= now.toISOString()) {
        // Post-write overlay: the model's board is never trusted for
        // material_hash (same principle as the board tool's generated_at
        // stamp, enforced one level up — tools/board.ts stays untouched).
        await writeBoardAtomic({ ...written, snapshots, material_hash: materialHash }, deps.boardDir);
        return "material";
      }
    } catch {
      // fall through to retry / degraded fallback (spec §2.4 — bad LLM output)
    }
  }

  // One retry exhausted: deterministic degraded board carrying events un-summarized.
  const fallback: Board = {
    generated_at: now.toISOString(),
    tick_status: "degraded",
    window: boardWindow,
    freshness,
    degradations: [
      ...degradations,
      { source: "agent", error: "agent produced no valid board after retry", since: now.toISOString() },
    ],
    prs: merged.map(toBoardPr),
    snapshots,
    material_hash: materialHash,
  };
  await writeBoardAtomic(fallback, deps.boardDir);
  return "degraded_fallback";
}
