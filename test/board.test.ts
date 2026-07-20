import { describe, it, expect } from "vitest";
import { mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  Board,
  BoardSchema,
  readBoard,
  renderBoardMd,
  sortBoardPrs,
  writeBoardAtomic,
} from "../agent/lib/board";

const pr = (state: Board["prs"][number]["state"], number: number): Board["prs"][number] => ({
  artifact_uri: `pr:o/r#${number}`, repo: "o/r", number, title: `PR ${number}`,
  url: `https://github.com/o/r/pull/${number}`, state,
  reason: "test", new_items: [],
});

const board: Board = {
  generated_at: "2026-07-17T08:00:00Z",
  tick_status: "ok",
  window: { since: "2026-07-14T08:00:00Z", until: "2026-07-17T08:00:00Z" },
  freshness: [{ source: "lectio", last_advanced_at: "2026-07-17T06:00:00Z" }],
  degradations: [],
  prs: [pr("resolved", 1), pr("needs_you", 2), pr("opened", 3), pr("active", 4)],
};

describe("BoardSchema", () => {
  it("accepts the spec board shape", () => {
    expect(BoardSchema.parse(board)).toBeTruthy();
  });
  it("rejects unknown tick_status", () => {
    expect(() => BoardSchema.parse({ ...board, tick_status: "meh" })).toThrow();
  });
  it("rejects prs with unknown state", () => {
    expect(() => BoardSchema.parse({ ...board, prs: [{ ...pr("opened", 1), state: "blocked" }] })).toThrow();
  });
});

describe("sortBoardPrs", () => {
  it("enforces needs_you, active, opened, resolved", () => {
    expect(sortBoardPrs(board.prs).map((p) => p.state)).toEqual([
      "needs_you", "active", "opened", "resolved",
    ]);
  });
});

describe("renderBoardMd", () => {
  it("renders resolved as a footnote, not a full entry", () => {
    const md = renderBoardMd({ ...board, prs: sortBoardPrs(board.prs) });
    expect(md).toContain("## [needs_you] o/r#2");
    expect(md).not.toContain("## [resolved]");
    expect(md).toContain("Resolved: o/r#1");
  });
  it("renders an all-clear line when nothing is active", () => {
    const md = renderBoardMd({ ...board, tick_status: "all_clear", prs: [pr("resolved", 1)] });
    expect(md).toContain("All clear");
  });
});

describe("writeBoardAtomic / readBoard", () => {
  it("writes both files, leaves no temp files, round-trips", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-"));
    await writeBoardAtomic(board, dir);
    const files = await readdir(dir);
    expect(files.sort()).toEqual(["board.json", "board.md"]);
    const back = await readBoard(dir);
    expect(back?.generated_at).toBe(board.generated_at);
    expect(back?.prs[0].state).toBe("needs_you"); // sorted on write
    expect(await readFile(join(dir, "board.md"), "utf8")).toContain("# PR Board");
  });
  it("readBoard returns null when no board exists", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-empty-"));
    expect(await readBoard(dir)).toBeNull();
  });
  it("rejects an invalid board without touching files", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-bad-"));
    await expect(
      writeBoardAtomic({ ...board, tick_status: "meh" } as unknown as Board, dir),
    ).rejects.toThrow();
    expect(await readdir(dir)).toEqual([]);
  });

  it("never exposes a partial/corrupt board.json to a reader polling during a write", async () => {
    // Proves the write-temp-then-rename mechanics, not just that the function
    // ran without throwing: a large second write is raced against a burst of
    // concurrent readers. If writeBoardAtomic ever wrote board.json in place
    // (rather than via temp file + rename), a reader could catch it
    // half-written and fail to JSON.parse — that's the failure this test
    // would catch that "no temp files left afterward" cannot.
    const dir = await mkdtemp(join(tmpdir(), "board-race-"));
    const bigBoard = (tag: string): Board => ({
      ...board,
      generated_at: tag,
      prs: Array.from({ length: 4000 }, (_, i) => pr("opened", i)),
    });

    await writeBoardAtomic(bigBoard("v1"), dir);

    const writePromise = writeBoardAtomic(bigBoard("v2"), dir);

    const seenTags = new Set<string>();
    const readOnce = async () => {
      let raw: string;
      try {
        raw = await readFile(join(dir, "board.json"), "utf8");
      } catch {
        return; // ENOENT is the only acceptable failure, and only before the first write ever lands.
      }
      // A torn read (partial temp-write leaking, or a non-atomic in-place
      // write caught mid-flight) would throw here instead of parsing cleanly.
      const parsed = BoardSchema.parse(JSON.parse(raw));
      seenTags.add(parsed.generated_at);
    };
    // Fire a burst of concurrent reads while the write is in flight.
    await Promise.all(Array.from({ length: 100 }, () => readOnce()));
    await writePromise;
    await readOnce();

    for (const tag of seenTags) {
      expect(["v1", "v2"]).toContain(tag);
    }
    expect(seenTags.size).toBeGreaterThan(0);
  });
});

const snapshot = {
  kind: "weather",
  label: "Weather — Austin, TX",
  value: "72°F, clear",
  detail: "feels like 75°F, humidity 40%",
  as_of: "2026-07-18T15:04:00Z",
};

describe("board schema: snapshots + material_hash", () => {
  it("parses an old-format board.json with neither field (migration guarantee)", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-old-"));
    // `board` (top of this file) predates both fields — write it raw, bypassing writeBoardAtomic.
    await writeFile(join(dir, "board.json"), JSON.stringify(board), "utf8");
    const back = await readBoard(dir);
    expect(back).not.toBeNull();
    expect(back?.snapshots).toBeUndefined();
    expect(back?.material_hash).toBeUndefined();
  });

  it("renderBoardMd renders the Snapshots section after Freshness, in the specified format", () => {
    const md = renderBoardMd({ ...board, snapshots: [snapshot] });
    expect(md).toContain("## Snapshots");
    expect(md).toContain(
      "- Weather — Austin, TX: 72°F, clear (feels like 75°F, humidity 40%) — as of 2026-07-18T15:04:00Z",
    );
    expect(md.indexOf("## Freshness")).toBeLessThan(md.indexOf("## Snapshots"));
    expect(md.indexOf("## Snapshots")).toBeLessThan(md.indexOf("## [needs_you]"));
  });

  it("omits the detail parenthetical when detail is absent", () => {
    const { detail: _drop, ...noDetail } = snapshot;
    const md = renderBoardMd({ ...board, snapshots: [noDetail] });
    expect(md).toContain("- Weather — Austin, TX: 72°F, clear — as of 2026-07-18T15:04:00Z");
  });

  it("renders no Snapshots section when snapshots is absent or empty", () => {
    expect(renderBoardMd(board)).not.toContain("## Snapshots");
    expect(renderBoardMd({ ...board, snapshots: [] })).not.toContain("## Snapshots");
  });

  it("writeBoardAtomic round-trips both new fields", async () => {
    const dir = await mkdtemp(join(tmpdir(), "board-snap-"));
    await writeBoardAtomic({ ...board, snapshots: [snapshot], material_hash: "abc123" }, dir);
    const back = await readBoard(dir);
    expect(back?.snapshots).toEqual([snapshot]);
    expect(back?.material_hash).toBe("abc123");
  });
});
