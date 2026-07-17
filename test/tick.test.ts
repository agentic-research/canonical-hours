import { describe, it, expect, beforeEach } from "vitest";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runTick, inQuietHours, _resetTickGuardForTests, TickDeps } from "../agent/lib/tick";
import { readBoard, writeBoardAtomic, Board } from "../agent/lib/board";
import { Source, LifecycleEvent, Observation } from "../agent/sources/source";

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
