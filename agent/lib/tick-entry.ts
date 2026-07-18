import { lectioEnv } from "../connections/lectio";
import { GithubSource } from "../sources/github";
import { LectioSource, createMcpLectioCall } from "../sources/lectio";
import { runTick, TickResult } from "./tick";
import { createInvokeAgent, InvokeAgentRuntime } from "./invoke-agent";

/**
 * The scheduled tick, fully wired.
 *
 * Takes the schedule handler's `{ receive, appAuth }` (a subset of
 * `ScheduleHandlerArgs` — see invoke-agent.ts's `InvokeAgentRuntime` for why
 * this can't be a bare zero-arg function: `receive`/`appAuth` only exist
 * inside `agent/schedules/pr-board.ts`'s `run(...)` callback, per
 * docs/eve-api-notes.md fact 2).
 */
export async function prBoardTick(runtime: InvokeAgentRuntime): Promise<TickResult> {
  const { url, token } = lectioEnv();
  const result = await runTick({
    sources: [
      new LectioSource(createMcpLectioCall(url, token)),
      new GithubSource(process.env.GITHUB_TOKEN ?? ""),
    ],
    priority: ["lectio", "github"],
    invokeAgent: createInvokeAgent(runtime),
  });
  console.log(`[pr-board] tick result: ${result}`);
  return result;
}
