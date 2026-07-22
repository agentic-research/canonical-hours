import { defineTool } from "eve/tools";
import { BoardSchema, writeBoardAtomic } from "../lib/board";

export default defineTool({
  description:
    "Validate and atomically write the status board (board.json + board.md). " +
    "Input is the FULL board object — generated_at, tick_status, window, freshness, " +
    "degradations, items (PRs and Linear issues, mixed). Items are re-sorted " +
    "needs_you → active → opened → resolved. generated_at is stamped by the " +
    "runtime at write time, not read from your input — the tick's liveness " +
    "signal must not depend on the model's own clock. A malformed board is " +
    "rejected; call again with a corrected board.",
  inputSchema: BoardSchema,
  async execute(input) {
    // generated_at is runtime-authoritative, not model-authored: this is the
    // tick's core health signal ("a board older than ~5h means ticks are
    // failing"), so it must not depend on the LLM getting its own timestamp
    // right. Overwrite whatever the model supplied.
    const board = { ...input, generated_at: new Date().toISOString() };
    await writeBoardAtomic(board);
    return { written: true, items: board.items.length };
  },
});
