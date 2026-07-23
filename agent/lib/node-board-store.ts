import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Board, BoardSchema, BoardStore, sortBoardItems, renderBoardMd } from "@agentic-research/vespers-core";

export function boardDir(): string {
  return process.env.BOARD_DIR ?? "board";
}

/**
 * The Node/eve-side BoardStore implementation (canonical-hours-35893f) —
 * the exact write-temp-then-rename atomicity contract board.ts used to
 * implement as free functions, now behind vespers' BoardStore interface so
 * TickDeps.boardStore can be swapped for a workerd-native store (a Durable
 * Object, KV, etc.) without touching runTick itself.
 */
export class NodeBoardStore implements BoardStore {
  // `dir` is resolved lazily (per call, via `resolveDir()`) rather than once
  // in the constructor: the shared `nodeBoardStore` singleton below is
  // constructed once at module-import time, but tests mutate
  // `process.env.BOARD_DIR` per-test expecting each write()/read() call to
  // pick up the current value — the exact behavior the old free functions'
  // `dir: string = boardDir()` default parameter gave for free by
  // re-evaluating on every call.
  constructor(private readonly dir?: string) {}

  private resolveDir(): string {
    return this.dir ?? boardDir();
  }

  /** Validate + write board.json and board.md atomically: a poll never sees a half-written board. */
  async write(board: Board): Promise<void> {
    const dir = this.resolveDir();
    const validated = BoardSchema.parse({ ...board, items: sortBoardItems(board.items) });
    await mkdir(dir, { recursive: true });
    const jsonTmp = join(dir, ".board.json.tmp");
    const mdTmp = join(dir, ".board.md.tmp");
    await writeFile(jsonTmp, JSON.stringify(validated, null, 2), "utf8");
    await rename(jsonTmp, join(dir, "board.json"));
    await writeFile(mdTmp, renderBoardMd(validated), "utf8");
    await rename(mdTmp, join(dir, "board.md"));
  }

  async read(): Promise<Board | null> {
    const dir = this.resolveDir();
    try {
      const raw = await readFile(join(dir, "board.json"), "utf8");
      return BoardSchema.parse(JSON.parse(raw));
    } catch {
      return null;
    }
  }
}

/**
 * The process-wide default store: agent/tools/board.ts, agent/channels/board.ts,
 * agent/channels/mcp.ts's get_board, and agent/lib/tick-entry.ts's TickDeps
 * all share this one instance, matching today's behavior where every
 * zero-argument writeBoardAtomic()/readBoard() call resolved the same
 * BOARD_DIR-derived directory.
 */
export const nodeBoardStore = new NodeBoardStore();
