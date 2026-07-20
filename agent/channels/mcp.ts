import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BoardSchema, readBoard, renderBoardMd } from "../lib/board";
import { prBoardTick } from "../lib/tick-entry";
import type { TickResult } from "../lib/tick";
import type { InvokeAgentRuntime } from "../lib/invoke-agent";

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

/** = TickResult (agent/lib/tick.ts); `satisfies` keeps this in lockstep at compile time. */
export const TICK_RESULTS = [
  "skipped_overlap",
  "skipped_quiet",
  "all_clear",
  "material_unchanged",
  "material",
  "degraded_fallback",
] as const satisfies readonly TickResult[];

/**
 * `trigger_tick` — a second *trigger* for the identical tick logic the cron
 * schedule drives (agent/schedules/pr-board.ts forwards into the same
 * prBoardTick). Awaits the tick synchronously and returns the real
 * TickResult. `skipped_overlap` is a successful result, never isError: an
 * overlapping tick is a defined, healthy outcome (the in-process guard in
 * agent/lib/tick.ts is trigger-source-agnostic). Only a genuine
 * misconfiguration throw (e.g. lectioEnv() with LECTIO_URL/LECTIO_TOKEN
 * unset, which fires before runTick is reached) maps to isError.
 *
 * `tick` is injectable for tests only; production wiring (the channel
 * below) always uses the real prBoardTick.
 */
export function registerTriggerTickTool(
  server: McpServer,
  runtime: InvokeAgentRuntime,
  tick: (runtime: InvokeAgentRuntime) => Promise<TickResult> = prBoardTick,
): void {
  server.registerTool(
    "trigger_tick",
    {
      description:
        "Run one PR-board tick now (same logic as the cron schedule) and return its " +
        "result. 'skipped_overlap' means a tick was already running — the board will " +
        "be refreshed by that tick instead; retry later rather than immediately.",
      inputSchema: {},
      outputSchema: { result: z.enum(TICK_RESULTS) },
    },
    async () => {
      try {
        const result = await tick(runtime);
        return {
          content: [{ type: "text" as const, text: `tick result: ${result}` }],
          structuredContent: { result },
        };
      } catch (err) {
        return {
          content: [
            { type: "text" as const, text: err instanceof Error ? err.message : String(err) },
          ],
          isError: true,
        };
      }
    },
  );
}
