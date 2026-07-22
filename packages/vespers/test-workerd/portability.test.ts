import { describe, it, expect } from "vitest";
import {
  mergeEvents,
  foldState,
  computeMaterialHash,
  runTick,
  TickDeps,
  BoardStore,
  Board,
  Source,
  Artifact,
  LifecycleEvent,
  Observation,
  canonicalPrUri,
} from "../src/index";

/**
 * In-memory BoardStore — proves the interface is implementable without a
 * filesystem, the real substitute a workerd deployment would provide (a
 * Durable Object, KV, etc.) instead of canonical-hours' NodeBoardStore.
 */
class InMemoryBoardStore implements BoardStore {
  private board: Board | null = null;
  async write(board: Board): Promise<void> {
    this.board = board;
  }
  async read(): Promise<Board | null> {
    return this.board;
  }
}

const artifact: Artifact = {
  uri: canonicalPrUri("o", "r", 1),
  kind: "pr",
  repo: "o/r",
  number: 1,
  title: "Test PR",
  url: "https://github.com/o/r/pull/1",
};

const observation: Observation = {
  artifact_uri: artifact.uri,
  at: "2026-07-20T00:00:00Z",
  author: "someone",
  type: "review_changes_requested",
  payload: { preview: "please fix X" },
  classification: "hard",
};

const event: LifecycleEvent = { artifact, observations: [observation] };

describe("workerd portability (live, not asserted)", () => {
  it("mergeEvents + foldState run inside a simulated Workers runtime", () => {
    const merged = mergeEvents({ github: [event] }, ["github"]);
    expect(merged).toHaveLength(1);
    expect(merged[0].state).toBe("needs_you");
    expect(foldState([observation], [])).toBe("needs_you");
  });

  it("computeMaterialHash (node:crypto createHash, under the pool's enforced nodejs_compat_v2) runs inside a simulated Workers runtime", () => {
    const merged = mergeEvents({ github: [event] }, ["github"]);
    const hash = computeMaterialHash(merged);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("runTick end-to-end against an in-memory BoardStore, inside a simulated Workers runtime", async () => {
    const source: Source = {
      name: "fake",
      schema: { parse: (x: unknown) => x } as never,
      async fetch() {
        return [{}];
      },
      mapToLifecycleEvent() {
        return event;
      },
      async freshness() {
        return observation.at;
      },
    };
    const boardStore = new InMemoryBoardStore();
    const deps: TickDeps = {
      sources: [source],
      priority: ["fake"],
      boardStore,
      invokeAgent: async () => {
        await boardStore.write({
          generated_at: new Date().toISOString(),
          tick_status: "ok",
          window: { since: "2026-07-17T00:00:00Z", until: "2026-07-20T00:00:00Z" },
          freshness: [],
          degradations: [],
          items: [],
        });
      },
    };
    const result = await runTick(deps);
    expect(result).toBe("material");
    const written = await boardStore.read();
    expect(written).not.toBeNull();
  });
});
