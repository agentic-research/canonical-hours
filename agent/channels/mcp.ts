import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BoardSchema, readBoard, renderBoardMd } from "../lib/board";

/**
 * `get_board` — read-only MCP view of the existing board contract.
 * Structured primary return is the full Board JSON (the same contract
 * `GET /board` serves, typed by BoardSchema); the text content is the
 * rendered markdown (`GET /board/md`'s format) so a model-side caller gets
 * a zero-parsing render. board:null is a legitimate state (no tick has
 * ever completed), not an error — the MCP analog of board.ts's 404.
 */
export function registerGetBoardTool(server: McpServer): void {
  server.registerTool(
    "get_board",
    {
      description:
        "Read the current PR status board. Returns the full board JSON as structured " +
        "content and the rendered markdown as text. Read-only; never triggers a tick.",
      inputSchema: {},
      outputSchema: { board: BoardSchema.nullable() },
    },
    async () => {
      const board = await readBoard();
      return {
        content: [
          {
            type: "text" as const,
            text: board ? renderBoardMd(board) : "No board yet — no tick has completed.",
          },
        ],
        structuredContent: { board },
      };
    },
  );
}
