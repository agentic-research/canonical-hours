#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import type { TickResult } from "@agentic-research/vespers-core";
import type { InvokeAgentRuntime } from "../agent/lib/invoke-agent";
import { prBoardTick } from "../agent/lib/tick-entry";

type TickRunner = (runtime: InvokeAgentRuntime) => Promise<TickResult>;

export interface RunOneTickOptions {
  env?: NodeJS.ProcessEnv | Record<string, string | undefined>;
  tick?: TickRunner;
  log?: (message: string) => void;
}

export async function runOneTick(options: RunOneTickOptions = {}): Promise<TickResult> {
  const env = options.env ?? process.env;
  const tick = options.tick ?? prBoardTick;

  if (!env.CANONICAL_HOURS_NO_MODEL?.trim()) {
    env.CANONICAL_HOURS_NO_MODEL = "1";
  }

  const runtime: InvokeAgentRuntime = {
    async receive() {
      throw new Error(
        "model invocation is disabled for scripts/run-tick.ts; unset CANONICAL_HOURS_NO_MODEL and use `task dev` for Eve agent summaries",
      );
    },
    appAuth: {} as InvokeAgentRuntime["appAuth"],
  };

  return tick(runtime);
}

async function main(): Promise<void> {
  const result = await runOneTick();
  const boardDir = process.env.BOARD_DIR?.trim() || "board";
  console.log(`[pr-board] one-shot tick result: ${result}`);
  console.log(`[pr-board] board JSON: ${boardDir}/board.json`);
  console.log(`[pr-board] board Markdown: ${boardDir}/board.md`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.stack ?? err.message : String(err));
    process.exitCode = 1;
  });
}
