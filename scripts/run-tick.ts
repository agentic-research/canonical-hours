#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import type { TickResult } from "@agentic-research/vespers-core";
import type { InvokeAgentRuntime } from "../agent/lib/invoke-agent";

type TickRunner = (runtime: InvokeAgentRuntime) => Promise<TickResult>;
type TickLoader = () => Promise<TickRunner>;
type EnvReader = (path: string) => Promise<string>;

export interface RunOneTickOptions {
  env?: NodeJS.ProcessEnv | Record<string, string | undefined>;
  tick?: TickRunner;
  loadTick?: TickLoader;
  envFilePath?: string;
  readEnvFile?: EnvReader;
  log?: (message: string) => void;
}

function parseEnvValue(raw: string): string {
  const value = raw.trim();
  if (value.startsWith("#")) return "";
  const quote = value[0];
  if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
    return value.slice(1, -1);
  }
  return value.replace(/\s+#.*$/, "").trim();
}

export function applyEnvFile(
  content: string,
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): void {
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (env[key] !== undefined) continue;
    env[key] = parseEnvValue(rawValue);
  }
}

async function defaultLoadTick(): Promise<TickRunner> {
  const { prBoardTick } = await import("../agent/lib/tick-entry");
  return prBoardTick;
}

async function loadEnvFile(options: Required<Pick<RunOneTickOptions, "env" | "envFilePath" | "readEnvFile">>): Promise<void> {
  try {
    applyEnvFile(await options.readEnvFile(options.envFilePath), options.env);
  } catch (err) {
    if (!(err instanceof Error && "code" in err && err.code === "ENOENT")) {
      throw err;
    }
  }
}

export async function runOneTick(options: RunOneTickOptions = {}): Promise<TickResult> {
  const env = options.env ?? process.env;
  await loadEnvFile({
    env,
    envFilePath: options.envFilePath ?? ".env",
    readEnvFile: options.readEnvFile ?? ((path) => readFile(path, "utf8")),
  });
  const tick = options.tick ?? (await (options.loadTick ?? defaultLoadTick)());

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
