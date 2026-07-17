import { defineTool } from "eve/tools";
import { BoardSchema, writeBoardAtomic } from "../lib/board";

export default defineTool({
  description:
    "Validate and atomically write the PR status board (board.json + board.md). " +
    "Input is the FULL board object — generated_at, tick_status, window, freshness, " +
    "degradations, prs. PRs are re-sorted needs_you → active → opened → resolved. " +
    "A malformed board is rejected; call again with a corrected board.",
  inputSchema: BoardSchema,
  async execute(input) {
    await writeBoardAtomic(input);
    return { written: true, prs: input.prs.length };
  },
});
