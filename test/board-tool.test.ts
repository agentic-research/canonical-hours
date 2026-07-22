import { describe, it, expect } from "vitest";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import boardTool from "../agent/tools/board";
import { readBoard, Board } from "../agent/lib/board";
import type { ToolContext } from "eve/tools";

const fakeCtx = {} as ToolContext;

const board = (generatedAt: string): Board => ({
  generated_at: generatedAt,
  tick_status: "ok",
  window: { since: "2026-07-14T08:00:00Z", until: "2026-07-17T08:00:00Z" },
  freshness: [],
  degradations: [],
  items: [],
});

describe("board tool", () => {
  it("overwrites a stale/wrong model-supplied generated_at with a fresh runtime timestamp", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-tool-"));
    const originalEnv = process.env.BOARD_DIR;
    process.env.BOARD_DIR = dir;
    try {
      // The "model" hands the tool a wildly stale timestamp — this must not
      // survive to what's actually persisted, since the tick's own
      // success/liveness check (agent/lib/tick.ts) trusts generated_at.
      const staleModelInput = board("2020-01-01T00:00:00Z");
      const before = new Date();
      const result = await boardTool.execute(staleModelInput, fakeCtx);
      const after = new Date();

      expect(result).toEqual({ written: true, items: 0 });

      const written = await readBoard(dir);
      expect(written).not.toBeNull();
      expect(written!.generated_at).not.toBe("2020-01-01T00:00:00Z");
      const writtenTime = new Date(written!.generated_at).getTime();
      expect(writtenTime).toBeGreaterThanOrEqual(before.getTime());
      expect(writtenTime).toBeLessThanOrEqual(after.getTime());
    } finally {
      if (originalEnv === undefined) delete process.env.BOARD_DIR;
      else process.env.BOARD_DIR = originalEnv;
    }
  });
});
