import type { SessionAuthContext } from "eve/context";
import type { ScheduleHandlerArgs } from "eve/schedules";
import type { AgentTickInput } from "@agentic-research/vespers-core";
import tickChannel from "../channels/tick";

export type { AgentTickInput };

export function agentPrompt(input: AgentTickInput): string {
  return [
    "Material tick. Render the PR board from these merged lifecycle events,",
    "following your instructions and the pr-board skill. Call the `board` tool",
    "exactly once with the complete board object.",
    "",
    "```json",
    JSON.stringify(input, null, 2),
    "```",
  ].join("\n");
}

/**
 * The subset of a schedule handler's `ScheduleHandlerArgs`
 * (docs/eve-api-notes.md fact 2, node_modules/eve/dist/src/public/definitions/schedule.d.ts)
 * that invokeAgent needs. `receive` and `appAuth` only exist inside a
 * schedule's `run({ receive, waitUntil, appAuth })` callback — they are not
 * importable module-level values — so the brief's flat
 * `invokeAgent(input: AgentTickInput): Promise<void>` free function shape
 * cannot be wired to the real eve invocation API. `createInvokeAgent` below
 * is a factory that closes over those handler-scoped values instead; see
 * docs/eve-api-notes.md fact 2 for the full resolution against the brief's draft.
 */
export interface InvokeAgentRuntime {
  receive: ScheduleHandlerArgs["receive"];
  appAuth: SessionAuthContext;
}

/**
 * Builds a `TickDeps["invokeAgent"]` closure from a schedule handler's
 * runtime args. Hands the material tick input to the pr-board agent
 * (agent/agent.ts) via the internal tick channel (agent/channels/tick.ts);
 * the agent's own `board` tool call (Task 6) does the actual write —
 * this function does not write the board itself. Resolves only once the
 * agent's turn has settled (see agent/channels/tick.ts for why), so
 * runTick's post-invocation `readBoard()` check is meaningful.
 */
export function createInvokeAgent(
  runtime: InvokeAgentRuntime,
): (input: AgentTickInput) => Promise<void> {
  return async (input) => {
    await runtime.receive(tickChannel, {
      message: agentPrompt(input),
      target: {},
      auth: runtime.appAuth,
    });
  };
}
