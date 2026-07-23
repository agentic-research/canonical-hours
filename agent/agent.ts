import { defineAgent } from "eve";
import { anthropic } from "@ai-sdk/anthropic";

/**
 * pr-board standing agent (spec §2.2).
 * - Model: Haiku via the direct @ai-sdk/anthropic provider — runtime reads
 *   ANTHROPIC_API_KEY at call time; bypasses Vercel AI Gateway (steve
 *   pattern, docs/eve-api-notes.md). Haiku is the locked choice: this is
 *   formatting/summarization over structured data, not open-ended reasoning.
 * - Workflow world: eve's default local/file world (Vercel Workflow on
 *   Vercel, the SDK's local world otherwise). Deliberately not a hosted SQL
 *   database (spec Approach A1) — the board is a cache; a lost tick just
 *   reruns. We simply omit the `experimental` workflow-world override
 *   rather than pointing it at any external world package.
 * - Sandbox backend selection lives in agent/sandbox.ts (env-driven via
 *   SANDBOX_BACKEND), picked up automatically by eve's file convention.
 * - Connections (agent/connections/), tools (agent/tools/), and skills
 *   (agent/skills/) register by eve's directory convention — the filename
 *   becomes the runtime name, so agent/connections/lectio.ts (Task 3) and
 *   agent/tools/board.ts (Task 6) are already live without being referenced
 *   here. Task 8 will add agent/skills/pr-board/SKILL.md the same way.
 */
export default defineAgent({
  model: anthropic("claude-haiku-4-5"),
});
