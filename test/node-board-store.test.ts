import { describe, it, expect } from "vitest";
import { mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Board, BoardSchema } from "@agentic-research/vespers-core";
import { NodeBoardStore } from "../agent/lib/node-board-store";

const prItem = (state: Board["items"][number]["state"], number: number): Extract<Board["items"][number], { kind: "pr" }> => ({
  kind: "pr", artifact_uri: `pr:o/r#${number}`, repo: "o/r", number, title: `PR ${number}`,
  url: `https://github.com/o/r/pull/${number}`, state,
  reason: "test", new_items: [],
});

const board: Board = {
  generated_at: "2026-07-17T08:00:00Z",
  tick_status: "ok",
  window: { since: "2026-07-14T08:00:00Z", until: "2026-07-17T08:00:00Z" },
  freshness: [{ source: "lectio", last_advanced_at: "2026-07-17T06:00:00Z" }],
  degradations: [],
  items: [prItem("resolved", 1), prItem("needs_you", 2), prItem("opened", 3), prItem("active", 4)],
};

describe("NodeBoardStore", () => {
  it("writes both files, leaves no temp files, round-trips", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-"));
    const store = new NodeBoardStore(dir);
    await store.write(board);
    const files = await readdir(dir);
    expect(files.sort()).toEqual(["board.json", "board.md"]);
    const back = await store.read();
    expect(back?.generated_at).toBe(board.generated_at);
    expect(back?.items[0].state).toBe("needs_you"); // sorted on write
    expect(await readFile(join(dir, "board.md"), "utf8")).toContain("# Board");
  });

  it("read returns null when no board exists", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-empty-"));
    const store = new NodeBoardStore(dir);
    expect(await store.read()).toBeNull();
  });

  it("rejects an invalid board without touching files", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-bad-"));
    const store = new NodeBoardStore(dir);
    await expect(
      store.write({ ...board, tick_status: "meh" } as unknown as Board),
    ).rejects.toThrow();
    expect(await readdir(dir)).toEqual([]);
  });

  it("never exposes a partial/corrupt board.json to a reader polling during a write", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-race-"));
    const store = new NodeBoardStore(dir);
    const bigBoard = (tag: string): Board => ({
      ...board,
      generated_at: tag,
      items: Array.from({ length: 4000 }, (_, i) => prItem("opened", i)),
    });

    await store.write(bigBoard("v1"));
    const writePromise = store.write(bigBoard("v2"));

    const seenTags = new Set<string>();
    const readOnce = async () => {
      let raw: string;
      try {
        raw = await readFile(join(dir, "board.json"), "utf8");
      } catch {
        return;
      }
      const parsed = BoardSchema.parse(JSON.parse(raw));
      seenTags.add(parsed.generated_at);
    };
    await Promise.all(Array.from({ length: 100 }, () => readOnce()));
    await writePromise;
    await readOnce();

    for (const tag of seenTags) {
      expect(["v1", "v2"]).toContain(tag);
    }
    expect(seenTags.size).toBeGreaterThan(0);
  });

  it("parses an old-format board.json with neither snapshots nor material_hash (migration guarantee)", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-old-"));
    await writeFile(join(dir, "board.json"), JSON.stringify(board), "utf8");
    const store = new NodeBoardStore(dir);
    const back = await store.read();
    expect(back).not.toBeNull();
    expect(back?.snapshots).toBeUndefined();
    expect(back?.material_hash).toBeUndefined();
  });

  it("round-trips both new fields (snapshots, material_hash)", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-snap-"));
    const store = new NodeBoardStore(dir);
    const snapshot = {
      kind: "weather",
      label: "Weather — Austin, TX",
      value: "72°F, clear",
      detail: "feels like 75°F, humidity 40%",
      as_of: "2026-07-18T15:04:00Z",
    };
    await store.write({ ...board, snapshots: [snapshot], material_hash: "abc123" });
    const back = await store.read();
    expect(back?.snapshots).toEqual([snapshot]);
    expect(back?.material_hash).toBe("abc123");
  });
});
