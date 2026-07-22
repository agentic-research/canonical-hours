import { describe, it, expect, beforeEach } from "vitest";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runTick, inQuietHours, _resetTickGuardForTests, computeMaterialHash, TickDeps, Board, Source, LifecycleEvent, Observation, MergedArtifact, SnapshotSource } from "@vespers/core";
import { NodeBoardStore } from "../agent/lib/node-board-store";

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
    boardStore: new NodeBoardStore(dir),
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
    const board = await d.boardStore.read();
    expect(board?.tick_status).toBe("all_clear");
    expect(board?.generated_at).toBe(NOW.toISOString());
    expect(board?.items[0].state).toBe("resolved");
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
        items: input.merged.map((m) => {
          if (m.artifact.kind !== "pr") throw new Error("test fixture expects pr");
          return {
            kind: "pr" as const,
            artifact_uri: m.artifact.uri, repo: m.artifact.repo, number: m.artifact.number,
            title: m.artifact.title, url: m.artifact.url, state: m.state,
            reason: "r", new_items: [], summary: "Mark commented.",
          };
        }),
      };
      await d.boardStore.write(board);
    };
    expect(await runTick(d)).toBe("material");
    const board = await d.boardStore.read();
    expect(board?.tick_status).toBe("ok");
    expect(board?.items[0].summary).toBe("Mark commented.");
  });

  it("bad/absent agent output → one retry, then deterministic degraded board", async () => {
    let attempts = 0;
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({})])])],
      invokeAgent: async () => { attempts++; }, // never writes a board
    });
    expect(await runTick(d)).toBe("degraded_fallback");
    expect(attempts).toBe(2);
    const board = await d.boardStore.read();
    expect(board?.tick_status).toBe("degraded");
    expect(board?.degradations.some((x) => x.source === "agent")).toBe(true);
    expect(board?.items[0].state).toBe("needs_you"); // merged events carried, un-summarized
    expect(board?.items[0].summary).toBeUndefined();
  });

  it("one source failing does not stop the other; degradation recorded", async () => {
    const d = await deps({
      sources: [
        fakeSource("lectio", [], true),
        fakeSource("github", [event("pr:o/r#1", [obs({ type: "merge" })])]),
      ],
    });
    expect(await runTick(d)).toBe("all_clear");
    const board = await d.boardStore.read();
    expect(board?.tick_status).toBe("degraded");
    expect(board?.degradations).toEqual([
      { source: "lectio", error: "lectio unreachable", since: NOW.toISOString() },
    ]);
    expect(board?.items).toHaveLength(1);
  });

  it("degradations.since is carried from the previous board (how long dark)", async () => {
    const d = await deps({ sources: [fakeSource("lectio", [], true)] });
    const earlier = "2026-07-16T20:00:00Z";
    await d.boardStore.write({
      generated_at: earlier, tick_status: "degraded",
      window: { since: earlier, until: earlier },
      freshness: [], items: [],
      degradations: [{ source: "lectio", error: "old", since: earlier }],
    });
    await runTick(d);
    const board = await d.boardStore.read();
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

  it("a source event's extra.merge_ready flows through to the board PR entry", async () => {
    // No observations → opened → non-material, so runTick's templated path builds
    // the board via toBoardItem, exercising the extra → merge_ready passthrough end to end.
    const ev = event("pr:o/r#1", []);
    ev.extra = { merge_ready: true };
    const d = await deps({ sources: [fakeSource("lectio", [ev])] });
    expect(await runTick(d)).toBe("all_clear");
    const board = await d.boardStore.read();
    const item = board?.items[0];
    expect(item?.kind).toBe("pr");
    if (item?.kind === "pr") expect(item.merge_ready).toBe(true);
  });

  it("a source event's extra.reason overrides the generic per-state reason text", async () => {
    const ev = event("issue:art/art-1", []);
    ev.artifact = { uri: "issue:art/art-1", kind: "issue", team: "ART", identifier: "ART-1", title: "t", url: "https://linear.app/x" };
    ev.state_hint = "needs_you";
    ev.extra = { reason: "P1 stuck in Triage for 9d" };
    const d = await deps({ sources: [fakeSource("linear", [ev])] });
    expect(await runTick(d)).toBe("degraded_fallback");
    const board = await d.boardStore.read();
    expect(board?.items[0].reason).toBe("P1 stuck in Triage for 9d");
  });

  it("an issue-kind board item renders team/identifier, not repo/number", async () => {
    const ev = event("issue:art/art-1", []);
    ev.artifact = { uri: "issue:art/art-1", kind: "issue", team: "ART", identifier: "ART-1", title: "Stale ticket", url: "https://linear.app/x" };
    ev.state_hint = "needs_you";
    const d = await deps({ sources: [fakeSource("linear", [ev])] });
    await runTick(d);
    const board = await d.boardStore.read();
    const item = board?.items[0];
    expect(item?.kind).toBe("issue");
    if (item?.kind === "issue") {
      expect(item.team).toBe("ART");
      expect(item.identifier).toBe("ART-1");
    }
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
      items: input.merged.map((m) => {
        if (m.artifact.kind !== "pr") throw new Error("test fixture expects pr");
        return {
          kind: "pr" as const,
          artifact_uri: m.artifact.uri, repo: m.artifact.repo, number: m.artifact.number,
          title: m.artifact.title, url: m.artifact.url, state: m.state,
          reason: "agent-authored reason", new_items: [], summary: "Mark commented.",
        };
      }),
    };
    await d.boardStore.write(board);
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
    const after1 = await d.boardStore.read();
    expect(after1?.material_hash).toBeDefined();
    expect(after1?.items[0].summary).toBe("Mark commented.");

    // Tick 2: same data, later now — LLM skipped entirely, board still refreshed.
    clock.now = NOW2;
    expect(await runTick(d)).toBe("material_unchanged");
    expect(counter.calls).toBe(1); // counter still 1 — zero new LLM calls
    const after2 = await d.boardStore.read();
    expect(after2?.generated_at).toBe(NOW2.toISOString()); // staleness health signal stays alive
    expect(after2!.generated_at > after1!.generated_at).toBe(true);
    expect(after2?.items[0].summary).toBe("Mark commented."); // LLM prose carried over byte-identical
    // Deterministic fields re-derived from THIS tick's fold, not copied from the agent board:
    expect(after2?.items[0].reason).toBe("unanswered review/comment or standing changes_requested");
    expect(after2?.items[0].new_items).toHaveLength(1);
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
    const board = await d.boardStore.read();
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
    const fallback = await d.boardStore.read();
    expect(fallback?.material_hash).toBeDefined(); // fallback board carries the hash too

    clock.now = NOW2;
    expect(await runTick(d)).toBe("degraded_fallback");
    expect(counter.calls).toBe(4); // retried — NOT short-circuited by the matching hash
  });
});

describe("snapshot sources in runTick", () => {
  const okSnapshot: SnapshotSource = {
    name: "weather",
    async fetch() {
      return {
        kind: "weather", label: "Weather — Austin, TX",
        value: "72°F, clear", as_of: "2026-07-17T07:55:00Z",
      };
    },
    async freshness() { return "2026-07-17T07:55:00Z"; },
  };

  it("a successful snapshot source lands on the board with a freshness entry", async () => {
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({ type: "merge" })])])],
      snapshotSources: [okSnapshot],
    });
    expect(await runTick(d)).toBe("all_clear");
    const board = await d.boardStore.read();
    expect(board?.snapshots).toEqual([
      { kind: "weather", label: "Weather — Austin, TX", value: "72°F, clear", as_of: "2026-07-17T07:55:00Z" },
    ]);
    expect(board?.freshness).toContainEqual({ source: "weather", last_advanced_at: "2026-07-17T07:55:00Z" });
    expect(board?.tick_status).toBe("all_clear"); // no degradation
  });

  it("a throwing snapshot source degrades with since carried forward; PR pipeline unaffected", async () => {
    const boom: SnapshotSource = {
      name: "weather",
      async fetch() { throw new Error("weather unreachable"); },
      async freshness() { return null; },
    };
    const clock = { now: NOW };
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({ type: "merge" })])])],
      snapshotSources: [boom],
      now: () => clock.now,
    });
    expect(await runTick(d)).toBe("all_clear"); // never blocks the PR pipeline
    const first = await d.boardStore.read();
    expect(first?.tick_status).toBe("degraded");
    expect(first?.degradations).toEqual([
      { source: "weather", error: "weather unreachable", since: NOW.toISOString() },
    ]);
    expect(first?.snapshots).toEqual([]); // board still written; weather's value simply absent
    expect(first?.freshness).toContainEqual({ source: "weather", last_advanced_at: null });
    expect(first?.items).toHaveLength(1); // PR content unaffected

    clock.now = NOW2;
    expect(await runTick(d)).toBe("all_clear");
    const second = await d.boardStore.read();
    expect(second?.degradations[0].since).toBe(NOW.toISOString()); // carried forward, identical to activity sources
  });

  it("a snapshot source whose freshness() throws records last_advanced_at: null", async () => {
    const flaky: SnapshotSource = {
      name: "weather",
      async fetch() {
        return { kind: "weather", label: "Weather — Austin, TX", value: "72°F, clear", as_of: "2026-07-17T07:55:00Z" };
      },
      async freshness() { throw new Error("freshness broken"); },
    };
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({ type: "merge" })])])],
      snapshotSources: [flaky],
    });
    expect(await runTick(d)).toBe("all_clear");
    const board = await d.boardStore.read();
    expect(board?.freshness).toContainEqual({ source: "weather", last_advanced_at: null });
    expect(board?.snapshots).toHaveLength(1); // fetch still succeeded
  });
});

describe("snapshots + material_hash land on every outcome", () => {
  const value = {
    kind: "weather", label: "Weather — Austin, TX",
    value: "72°F, clear", as_of: "2026-07-17T07:55:00Z",
  };
  const stub: SnapshotSource = {
    name: "weather",
    async fetch() { return value; },
    async freshness() { return value.as_of; },
  };

  it("all_clear", async () => {
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({ type: "merge" })])])],
      snapshotSources: [stub],
    });
    expect(await runTick(d)).toBe("all_clear");
    const board = await d.boardStore.read();
    expect(board?.snapshots).toEqual([value]);
    expect(board?.material_hash).toBeDefined();
  });

  it("material (agent-written board gets the overlay — the agent never sees either field)", async () => {
    const counter = { calls: 0 };
    const clock = { now: NOW };
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({})])])],
      snapshotSources: [stub],
      now: () => clock.now,
    });
    d.invokeAgent = summarizingAgent(d, counter, clock); // writes a board WITHOUT snapshots/hash
    expect(await runTick(d)).toBe("material");
    const board = await d.boardStore.read();
    expect(board?.snapshots).toEqual([value]); // overlaid by runTick, not authored by the agent
    expect(board?.material_hash).toBeDefined();
    expect(board?.items[0].summary).toBe("Mark commented."); // agent's content preserved through the overlay
  });

  it("material_unchanged", async () => {
    const counter = { calls: 0 };
    const clock = { now: NOW };
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({})])])],
      snapshotSources: [stub],
      now: () => clock.now,
    });
    d.invokeAgent = summarizingAgent(d, counter, clock);
    expect(await runTick(d)).toBe("material");
    clock.now = NOW2;
    expect(await runTick(d)).toBe("material_unchanged");
    const board = await d.boardStore.read();
    expect(board?.snapshots).toEqual([value]);
    expect(board?.material_hash).toBeDefined();
  });

  it("degraded_fallback", async () => {
    const d = await deps({
      sources: [fakeSource("lectio", [event("pr:o/r#1", [obs({})])])],
      snapshotSources: [stub],
    });
    d.invokeAgent = async () => {}; // never writes → fallback after retry
    expect(await runTick(d)).toBe("degraded_fallback");
    const board = await d.boardStore.read();
    expect(board?.snapshots).toEqual([value]);
    expect(board?.material_hash).toBeDefined();
  });
});
