import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { defineChannel, GET, POST } from "eve/channels";
import type { SessionAuthContext } from "eve/context";
import { BoardSchema, readBoard, renderBoardMd } from "../lib/board";
import { prBoardTick } from "../lib/tick-entry";
import type { TickResult } from "../lib/tick";
import type { InvokeAgentRuntime } from "../lib/invoke-agent";
import { resolveAddressedThreads } from "../lib/thread-resolution";
import { dismissStaleBotReviews } from "../lib/bot-review-dismissal";
import { parsePrRef } from "../lib/pr-ref";
import { sharedSecretGate, type ActionGate, type HeaderLookup } from "../lib/action-gate";

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
 * agent/lib/tick.ts is trigger-source-agnostic). Every source's own
 * misconfiguration (including lectio's, now optional like every other
 * source) degrades instead of throwing — isError is reserved for genuine
 * runtime failures the tool call itself can't recover from (e.g. the MCP
 * transport layer rejecting the request), not for a source being unset.
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

const RESOLVE_RESULT_SCHEMA = {
  resolved: z.array(z.string()),
  skipped: z.array(z.string()),
  failed: z.array(z.object({ id: z.string(), error: z.string() })),
};

/**
 * `resolve_addressed_review_threads` — mechanical eligibility ported from
 * watch-pr.md §2c: resolves an unresolved thread iff its file changed in a
 * commit landed after the thread's originating review. Never called from
 * the tick — opt-in only, gated by `gate` (canonical-hours-49ba33; default
 * `sharedSecretGate()`, default-deny) before it ever touches GitHub.
 */
export function registerResolveThreadsTool(
  server: McpServer,
  gate: ActionGate = sharedSecretGate(),
): void {
  server.registerTool(
    "resolve_addressed_review_threads",
    {
      description:
        "Resolve unresolved GitHub PR review threads whose file was changed in a commit " +
        "landed after the thread's originating review. Mechanical eligibility only, no " +
        "judgment call — mutates GitHub. Input: a PR as 'owner/repo#123' or a github.com PR URL.",
      inputSchema: { pr: z.string() },
      outputSchema: RESOLVE_RESULT_SCHEMA,
    },
    async ({ pr }, extra) => {
      const verdict = await gate({
        toolName: "resolve_addressed_review_threads",
        headers: (extra.requestInfo?.headers ?? {}) as HeaderLookup,
      });
      if (!verdict.allowed) {
        return { content: [{ type: "text" as const, text: `denied: ${verdict.reason}` }], isError: true };
      }
      try {
        const ref = parsePrRef(pr);
        const result = await resolveAddressedThreads(ref, process.env.GITHUB_TOKEN ?? "", fetch);
        return {
          content: [
            {
              type: "text" as const,
              text: `resolved ${result.resolved.length}, skipped ${result.skipped.length}, failed ${result.failed.length}`,
            },
          ],
          structuredContent: { ...result },
        };
      } catch (err) {
        return {
          content: [{ type: "text" as const, text: err instanceof Error ? err.message : String(err) }],
          isError: true,
        };
      }
    },
  );
}

const DISMISS_RESULT_SCHEMA = {
  dismissed: z.array(z.string()),
  skipped: z.array(z.string()),
  failed: z.array(z.object({ id: z.string(), error: z.string() })),
};

/**
 * `dismiss_stale_bot_reviews` — mechanical eligibility ported from
 * watch-pr.md §2d: dismisses a CHANGES_REQUESTED bot review iff a fix commit
 * landed after it. Bot detection is __typename === "Bot" or a [bot]-suffixed
 * login — never a bare "-bot" suffix (human usernames can collide). Never
 * called from the tick — opt-in only, gated by `gate` (canonical-hours-49ba33;
 * default `sharedSecretGate()`, default-deny) before it ever touches GitHub.
 */
export function registerDismissBotReviewsTool(
  server: McpServer,
  gate: ActionGate = sharedSecretGate(),
): void {
  server.registerTool(
    "dismiss_stale_bot_reviews",
    {
      description:
        "Dismiss stale CHANGES_REQUESTED reviews from bot accounts where a fix commit landed " +
        "after the review. Mechanical eligibility only, no judgment call — mutates GitHub. " +
        "Input: a PR as 'owner/repo#123' or a github.com PR URL.",
      inputSchema: { pr: z.string() },
      outputSchema: DISMISS_RESULT_SCHEMA,
    },
    async ({ pr }, extra) => {
      const verdict = await gate({
        toolName: "dismiss_stale_bot_reviews",
        headers: (extra.requestInfo?.headers ?? {}) as HeaderLookup,
      });
      if (!verdict.allowed) {
        return { content: [{ type: "text" as const, text: `denied: ${verdict.reason}` }], isError: true };
      }
      try {
        const ref = parsePrRef(pr);
        const result = await dismissStaleBotReviews(ref, process.env.GITHUB_TOKEN ?? "", fetch);
        return {
          content: [
            {
              type: "text" as const,
              text: `dismissed ${result.dismissed.length}, skipped ${result.skipped.length}, failed ${result.failed.length}`,
            },
          ],
          structuredContent: { ...result },
        };
      } catch (err) {
        return {
          content: [{ type: "text" as const, text: err instanceof Error ? err.message : String(err) }],
          isError: true,
        };
      }
    },
  );
}

/**
 * Hand-built app principal (docs/eve-api-notes.md fact 2 + eve's
 * SessionAuthContext): route handlers get `receive` in their args but NOT
 * `appAuth` (that exists only on ScheduleHandlerArgs). Verify live during
 * implementation that eve accepts this; if a build rejects it, the failure
 * is graceful-and-visible by design — appAuth is only consumed on the
 * material path, whose throw runTick already absorbs into
 * retry-then-degraded_fallback (spec §2.1/§4).
 */
const appAuth = {
  attributes: {},
  authenticator: "app",
  principalId: "eve:app",
  principalType: "runtime",
} satisfies SessionAuthContext;

/** All four tools on a fresh McpServer, production wiring (real prBoardTick). */
export function buildMcpServer(runtime: InvokeAgentRuntime): McpServer {
  const server = new McpServer({ name: "canonical-hours", version: "0.1.0" });
  registerGetBoardTool(server);
  registerTriggerTickTool(server, runtime);
  registerResolveThreadsTool(server);
  registerDismissBotReviewsTool(server);
  return server;
}

/**
 * Streamable-HTTP MCP endpoint at /mcp (extensionless — dotted route paths
 * fail the Nitro build, docs/eve-api-notes.md fact 3). Per-request server +
 * stateless JSON transport is the SDK's documented stateless pattern; the
 * tick state it touches (`running` flag, board/ dir) is module-level in
 * agent/lib/, shared correctly across requests via Node's module cache.
 */
export default defineChannel({
  routes: [
    POST("/mcp", async (req, args) => {
      const server = buildMcpServer({ receive: args.receive, appAuth });
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless — no MCP session affinity
        enableJsonResponse: true, // plain JSON responses; neither tool streams
      });
      await server.connect(transport);
      return transport.handleRequest(req);
    }),
    // No SSE stream to offer in stateless JSON mode — deliberate, not an omission.
    GET("/mcp", async () => new Response(null, { status: 405 })),
  ],
});
