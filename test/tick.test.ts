import { describe, it, expect, beforeEach } from "vitest";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runTick, inQuietHours, _resetTickGuardForTests, computeMaterialHash, TickDeps } from "../agent/lib/tick";
import { readBoard, writeBoardAtomic, Board } from "../agent/lib/board";
import { Source, LifecycleEvent, Observation } from "../agent/sources/source";
import { MergedArtifact } from "../agent/sources/merge";

const obs = (partial: Partial<Observation>): Observation => ({
  artifact_uri: "pr:o/r#1", at: "2026-07-16T12:00:00Z", author: "mark",
  type: "comment", payload: { preview: "hi" }, classification: "hard", ...partial,
});

const event = (uri: string, observations: Observation[]): LifecycleEvent => ({
  artifact: {
    uri, kind: "pr", repo: "o/r", number: 1, title: "t",
    url: "https://github.com/o/r/pull/1",
  },
  observations,
});

function fakeSource(name: string, events: LifecycleEvent[], failFetch = false): Source {
  return {
    name,
    schema: { parse: (x: unknown) => x } as Source["schema"],
    async fetch() {
      if (failFetch) throw new Error(`${name} unreachable`);
      return events;
    },
    mapToLifecycleEvent(raw: unknown) {
      return raw as LifecycleEvent;
    },
    async freshness() {
      return "2026-07-17T06:00:00Z";
    },
  };
}

const NOW = new Date("2026-07-17T08:00:00Z");

async function deps(overrides: Partial<TickDeps>): Promise<TickDeps> {
  const dir = await mkdtemp(join(tmpdir(), "tick-"));
  return {
    sources: [],
    priority: ["lectio", "github"],
    now: () => NOW,
    invokeAgent: async () => {},
    boardDir: dir,
    ...overrides,
  };
}

beforeEach(() => _resetTickGuardForTests());

describe("inQuietHours", () => {
  it("handles a window crossing midnight", () => {
    expect(inQuietHours(new Date("2026-07-17T23:30:00Z"), "22-07", "UTC")).toBe(true);
    expect(inQuietHours(new Date("2026-07-17T12:00:00Z"), "22-07", "UTC")).toBe(false);
    expect(inQuietHours(new Date("2026-07-17T23:30:00Z"), undefined, "UTC")).toBe(false);
  });
});

describe("runTick", () => {
  it("all-clear path writes a templated board with ZERO model calls", async () => {
    let agentCalls = 0;
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({ type: "merge" })])])],
      invokeAgent: async () => { agentCalls++; },
    });
    expect(await runTick(d)).toBe("all_clear");
    expect(agentCalls).toBe(0); // zero tokens on quiet ticks — asserted, per spec §2.5
    const board = await readBoard(d.boardDir);
    expect(board?.tick_status).toBe("all_clear");
    expect(board?.generated_at).toBe(NOW.toISOString());
    expect(board?.prs[0].state).toBe("resolved");
  });

  it("material path invokes the agent; agent's board write is accepted", async () => {
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({})])])], // unanswered comment → needs_you
    });
    d.invokeAgent = async (input) => {
      const board: Board = {
        generated_at: NOW.toISOString(),
        tick_status: "ok",
        window: input.window,
        freshness: input.freshness,
        degradations: input.degradations,
        prs: input.merged.map((m) => ({
          artifact_uri: m.artifact.uri, repo: m.artifact.repo, number: m.artifact.number,
          title: m.artifact.title, url: m.artifact.url, state: m.state,
          reason: "r", new_items: [], summary: "Mark commented.",
        })),
      };
      await writeBoardAtomic(board, d.boardDir);
    };
    expect(await runTick(d)).toBe("material");
    const board = await readBoard(d.boardDir);
    expect(board?.tick_status).toBe("ok");
    expect(board?.prs[0].summary).toBe("Mark commented.");
  });

  it("bad/absent agent output → one retry, then deterministic degraded board", async () => {
    let attempts = 0;
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({})])])],
      invokeAgent: async () => { attempts++; }, // never writes a board
    });
    expect(await runTick(d)).toBe("degraded_fallback");
    expect(attempts).toBe(2);
    const board = await readBoard(d.boardDir);
    expect(board?.tick_status).toBe("degraded");
    expect(board?.degradations.some((x) => x.source === "agent")).toBe(true);
    expect(board?.prs[0].state).toBe("needs_you"); // merged events carried, un-summarized
    expect(board?.prs[0].summary).toBeUndefined();
  });

  it("one source failing does not stop the other; degradation recorded", async () => {
    const d = await deps({
      sources: [
        fakeSource("lectio", [], true),
        fakeSource("github", [event("pr:o/r#1", [obs({ type: "merge" })])]),
      ],
    });
    expect(await runTick(d)).toBe("all_clear");
    const board = await readBoard(d.boardDir);
    expect(board?.tick_status).toBe("degraded");
    expect(board?.degradations).toEqual([
      { source: "lectio", error: "lectio unreachable", since: NOW.toISOString() },
    ]);
    expect(board?.prs).toHaveLength(1);
  });

  it("degradations.since is carried from the previous board (how long dark)", async () => {
    const d = await deps({ sources: [fakeSource("lectio", [], true)] });
    const earlier = "2026-07-16T20:00:00Z";
    await writeBoardAtomic(
      {
        generated_at: earlier, tick_status: "degraded",
        window: { since: earlier, until: earlier },
        freshness: [], prs: [],
        degradations: [{ source: "lectio", error: "old", since: earlier }],
      },
      d.boardDir,
    );
    await runTick(d);
    const board = await readBoard(d.boardDir);
    expect(board?.degradations[0].since).toBe(earlier);
  });

  it("overlap guard: a second concurrent tick is skipped", async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    const slow: Source = {
      ...fakeSource("lectio", []),
      async fetch() { await gate; return []; },
    };
    const d1 = await deps({ sources: [slow] });
    const d2 = await deps({ sources: [fakeSource("lectio", [])] });
    const first = runTick(d1);
    const second = await runTick(d2);
    expect(second).toBe("skipped_overlap");
    release();
    expect(await first).toBe("all_clear");
  });

  it("quiet hours skip the tick entirely", async () => {
    const d = await deps({ sources: [fakeSource("lectio", [])], quietHours: "22-07", quietTz: "UTC" });
    d.now = () => new Date("2026-07-17T23:30:00Z");
    expect(await runTick(d)).toBe("skipped_quiet");
  });
});

const ma = (uri: string, state: MergedArtifact["state"], obsAts: string[]): MergedArtifact => ({
  artifact: {
    uri, kind: "pr", repo: "o/r", number: 1, title: "t",
    url: "https://github.com/o/r/pull/1",
  },
  observations: obsAts.map((at) => obs({ artifact_uri: uri, at })),
  state,
});

describe("computeMaterialHash", () => {
  const a = ma("pr:o/r#1", "needs_you", ["2026-07-17T06:00:00Z"]);
  const b = ma("pr:o/r#2", "active", ["2026-07-17T05:00:00Z"]);

  it("is deterministic and order-insensitive", () => {
    expect(computeMaterialHash([a, b])).toBe(computeMaterialHash([b, a]));
    expect(computeMaterialHash([a, b])).toBe(computeMaterialHash([a, b]));
  });

  it("changes on a state flip (active ↔ needs_you)", () => {
    const flipped = { ...a, state: "active" as const };
    expect(computeMaterialHash([flipped, b])).not.toBe(computeMaterialHash([a, b]));
  });

  it("changes when the latest observation advances", () => {
    const advanced = ma("pr:o/r#1", "needs_you", ["2026-07-17T07:30:00Z"]);
    expect(computeMaterialHash([advanced, b])).not.toBe(computeMaterialHash([a, b]));
  });

  it("changes when an artifact is added or removed", () => {
    expect(computeMaterialHash([a])).not.toBe(computeMaterialHash([a, b]));
    expect(computeMaterialHash([b])).not.toBe(computeMaterialHash([a, b]));
  });

  it("empty-set hash is stable across calls", () => {
    expect(computeMaterialHash([])).toBe(computeMaterialHash([]));
  });

  // Falsification target: the tick is fully stateless (§Task 6) — every tick
  // re-fetches the whole window from scratch, so a new observation is not
  // guaranteed to have a timestamp later than the latest one already seen
  // (provider/ingestion clock skew, a backfilled comment, two events in the
  // same second). A hash keyed on only the max timestamp would silently miss
  // this — material_unchanged would fire and a genuinely new comment would
  // never get summarized. This test constructs exactly that case.
  it("changes when a new observation arrives with a timestamp that does not advance the max (out-of-order arrival)", () => {
    const before = ma("pr:o/r#1", "needs_you", ["2026-07-17T06:00:00Z"]);
    // Second observation is EARLIER than the one already seen — the max
    // timestamp is unchanged, but a real new comment has arrived.
    const afterBackfill = ma("pr:o/r#1", "needs_you", [
      "2026-07-17T06:00:00Z",
      "2026-07-17T05:55:00Z",
    ]);
    expect(computeMaterialHash([afterBackfill])).not.toBe(computeMaterialHash([before]));
  });

  it("changes when observation count changes even at an identical latest timestamp (duplicate/simultaneous events)", () => {
    const one = ma("pr:o/r#1", "needs_you", ["2026-07-17T06:00:00Z"]);
    const two = ma("pr:o/r#1", "needs_you", [
      "2026-07-17T06:00:00Z",
      "2026-07-17T06:00:00Z",
    ]);
    expect(computeMaterialHash([two])).not.toBe(computeMaterialHash([one]));
  });
});

const NOW2 = new Date("2026-07-17T08:05:00Z");
const NOW3 = new Date("2026-07-17T08:10:00Z");

/** invokeAgent stub mirroring the existing material-path test: writes a valid board, counts calls. */
function summarizingAgent(d: TickDeps, counter: { calls: number }, clock: { now: Date }) {
  return async (input: Parameters<TickDeps["invokeAgent"]>[0]) => {
    counter.calls++;
    const board: Board = {
      generated_at: clock.now.toISOString(),
      tick_status: "ok",
      window: input.window,
      freshness: input.freshness,
      degradations: input.degradations,
      prs: input.merged.map((m) => ({
        artifact_uri: m.artifact.uri, repo: m.artifact.repo, number: m.artifact.number,
        title: m.artifact.title, url: m.artifact.url, state: m.state,
        reason: "agent-authored reason", new_items: [], summary: "Mark commented.",
      })),
    };
    await writeBoardAtomic(board, d.boardDir);
  };
}

describe("three-way tick: material_unchanged", () => {
  it("identical material set on the next tick skips the LLM but refreshes the board", async () => {
    const events = [event("pr:o/r#1", [obs({})])]; // unanswered comment → needs_you
    const counter = { calls: 0 };
    const clock = { now: NOW };
    const d = await deps({ sources: [fakeSource("lectio", events)], now: () => clock.now });
    d.invokeAgent = summarizingAgent(d, counter, clock);

    // Tick 1: material — agent invoked once; runTick overlays material_hash post-write.
    expect(await runTick(d)).toBe("material");
    expect(counter.calls).toBe(1);
    const after1 = await readBoard(d.boardDir);
    expect(after1?.material_hash).toBeDefined();
    expect(after1?.prs[0].summary).toBe("Mark commented.");

    // Tick 2: same data, later now — LLM skipped entirely, board still refreshed.
    clock.now = NOW2;
    expect(await runTick(d)).toBe("material_unchanged");
    expect(counter.calls).toBe(1); // counter still 1 — zero new LLM calls
    const after2 = await readBoard(d.boardDir);
    expect(after2?.generated_at).toBe(NOW2.toISOString()); // staleness health signal stays alive
    expect(after2!.generated_at > after1!.generated_at).toBe(true);
    expect(after2?.prs[0].summary).toBe("Mark commented."); // LLM prose carried over byte-identical
    // Deterministic fields re-derived from THIS tick's fold, not copied from the agent board:
    expect(after2?.prs[0].reason).toBe("unanswered review/comment or standing changes_requested");
    expect(after2?.prs[0].new_items).toHaveLength(1);
    expect(after2?.tick_status).toBe("ok");
    expect(after2?.material_hash).toBe(after1?.material_hash);

    // Tick 3: a new observation on the material PR — hash changes, agent re-invoked.
    events[0].observations.push(obs({ at: "2026-07-17T08:07:00Z", payload: { preview: "again" } }));
    clock.now = NOW3;
    expect(await runTick(d)).toBe("material");
    expect(counter.calls).toBe(2);
  });

  it("all_clear board carries a material_hash (stable hash of the empty set)", async () => {
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({ type: "merge" })])])],
    });
    expect(await runTick(d)).toBe("all_clear");
    const board = await readBoard(d.boardDir);
    expect(board?.material_hash).toBeDefined();
  });

  it("non-material churn (a resolved PR gaining an observation) → material_unchanged", async () => {
    const resolvedObs = [obs({ artifact_uri: "pr:o/r#2", type: "merge" })];
    const events = [
      event("pr:o/r#1", [obs({})]),          // material: needs_you
      event("pr:o/r#2", resolvedObs),        // non-material: resolved
    ];
    const counter = { calls: 0 };
    const clock = { now: NOW };
    const d = await deps({ sources: [fakeSource("lectio", events)], now: () => clock.now });
    d.invokeAgent = summarizingAgent(d, counter, clock);

    expect(await runTick(d)).toBe("material");
    // Only the resolved artifact changes between ticks — the filtered material set's hash is unmoved.
    resolvedObs.push(obs({ artifact_uri: "pr:o/r#2", at: "2026-07-17T08:03:00Z", type: "comment" }));
    clock.now = NOW2;
    expect(await runTick(d)).toBe("material_unchanged");
    expect(counter.calls).toBe(1);
  });

  it("a hash match against an agent-fallback board still retries the agent (summaries recover after an outage)", async () => {
    const events = [event("pr:o/r#1", [obs({})])];
    const counter = { calls: 0 };
    const clock = { now: NOW };
    const d = await deps({ sources: [fakeSource("lectio", events)], now: () => clock.now });
    d.invokeAgent = async () => { counter.calls++; }; // never writes a board → fallback

    expect(await runTick(d)).toBe("degraded_fallback");
    expect(counter.calls).toBe(2); // initial + one retry (existing behavior)
    const fallback = await readBoard(d.boardDir);
    expect(fallback?.material_hash).toBeDefined(); // fallback board carries the hash too

    clock.now = NOW2;
    expect(await runTick(d)).toBe("degraded_fallback");
    expect(counter.calls).toBe(4); // retried — NOT short-circuited by the matching hash
  });
});
