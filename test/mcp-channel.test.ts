import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { registerGetBoardTool, registerTriggerTickTool } from "../agent/channels/mcp";
import { Board, BoardSchema, renderBoardMd, writeBoardAtomic } from "../agent/lib/board";
import { runTick, _resetTickGuardForTests } from "../agent/lib/tick";
import type { InvokeAgentRuntime } from "../agent/lib/invoke-agent";
import type { LifecycleEvent, Source } from "../agent/sources/source";

// Env the suite mutates; saved/restored around every test so mcp tests can't
// leak BOARD_DIR/LECTIO_* state into each other (vitest isolates files per
// worker, so cross-file leakage is not a concern).
const ENV_KEYS = ["BOARD_DIR", "LECTIO_URL", "LECTIO_TOKEN"] as const;
let savedEnv: Record<string, string | undefined>;
beforeEach(() => {
  savedEnv = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
});
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
});

/** Connect the SDK's real client to a fresh McpServer over an in-memory pair. */
async function connect(register: (server: McpServer) => void): Promise<Client> {
  const server = new McpServer({ name: "canonical-hours", version: "0.1.0" });
  register(server);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "mcp-channel-test", version: "0.0.0" });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

const FIXTURE_BOARD: Board = {
  generated_at: "2026-07-17T08:00:00Z",
  tick_status: "ok",
  window: { since: "2026-07-14T08:00:00Z", until: "2026-07-17T08:00:00Z" },
  freshness: [{ source: "lectio", last_advanced_at: "2026-07-17T06:00:00Z" }],
  degradations: [],
  prs: [
    {
      artifact_uri: "pr:o/r#1",
      repo: "o/r",
      number: 1,
      title: "t",
      url: "https://github.com/o/r/pull/1",
      state: "needs_you",
      reason: "unanswered review/comment or standing changes_requested",
      new_items: [],
      summary: "Mark commented.",
    },
  ],
};

/** Write the fixture board into a temp BOARD_DIR and point the env at it. */
async function useFixtureBoard(): Promise<Board> {
  const dir = await mkdtemp(join(tmpdir(), "mcp-board-"));
  await writeBoardAtomic(FIXTURE_BOARD, dir);
  process.env.BOARD_DIR = dir;
  // Return the written (validated/sorted) form for byte-exact md comparison.
  return BoardSchema.parse(FIXTURE_BOARD);
}

describe("get_board tool", () => {
  it("lists get_board with its description", async () => {
    const client = await connect(registerGetBoardTool);
    const tools = await client.listTools();
    const tool = tools.tools.find((t) => t.name === "get_board");
    expect(tool).toBeDefined();
    expect(tool?.description).toContain("Read-only");
  });

  it("returns the board as structured content and the rendered markdown as text", async () => {
    const written = await useFixtureBoard();
    const client = await connect(registerGetBoardTool);
    const result = await client.callTool({ name: "get_board", arguments: {} });
    expect(result.isError).toBeFalsy();
    const sc = result.structuredContent as { board: unknown };
    const parsed = BoardSchema.parse(sc.board);
    expect(parsed.prs[0].summary).toBe("Mark commented.");
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].type).toBe("text");
    expect(content[0].text).toBe(renderBoardMd(written));
  });

  it("returns board:null (not isError) when no board exists yet", async () => {
    process.env.BOARD_DIR = await mkdtemp(join(tmpdir(), "mcp-empty-"));
    const client = await connect(registerGetBoardTool);
    const result = await client.callTool({ name: "get_board", arguments: {} });
    expect(result.isError).toBeFalsy();
    expect((result.structuredContent as { board: unknown }).board).toBeNull();
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].text).toBe("No board yet — no tick has completed.");
  });
});

/** Runtime whose receive must never fire in these tests (no material path is reachable). */
function stubRuntime(): InvokeAgentRuntime {
  return {
    receive: (async () => {
      throw new Error("receive must not be called in these tests");
    }) as unknown as InvokeAgentRuntime["receive"],
    appAuth: {
      attributes: {},
      authenticator: "app",
      principalId: "eve:app",
      principalType: "runtime",
    },
  };
}

describe("trigger_tick tool", () => {
  beforeEach(() => _resetTickGuardForTests());

  it("returns the settled TickResult as structured content (injected tick)", async () => {
    const calls: InvokeAgentRuntime[] = [];
    const client = await connect((s) =>
      registerTriggerTickTool(s, stubRuntime(), async (runtime) => {
        calls.push(runtime);
        return "all_clear";
      }),
    );
    const result = await client.callTool({ name: "trigger_tick", arguments: {} });
    expect(result.isError).toBeFalsy();
    expect((result.structuredContent as { result: string }).result).toBe("all_clear");
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].text).toBe("tick result: all_clear");
    expect(calls).toHaveLength(1);
    expect(calls[0].appAuth.principalId).toBe("eve:app");
  });

  it("returns skipped_overlap (not isError) while another tick holds the guard — real prBoardTick", async () => {
    // Dummy env so prBoardTick's lectioEnv() preamble passes; nothing is ever
    // fetched — the guard rejects before any source I/O.
    process.env.LECTIO_URL = "http://127.0.0.1:1/mcp";
    process.env.LECTIO_TOKEN = "dummy";
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    const blocked: Source = {
      name: "lectio",
      schema: { parse: (x: unknown) => x } as Source["schema"],
      async fetch() {
        await gate;
        return [];
      },
      mapToLifecycleEvent(raw: unknown) {
        return raw as LifecycleEvent;
      },
      async freshness() {
        return null;
      },
    };
    const dir = await mkdtemp(join(tmpdir(), "mcp-tick-"));
    // Occupy the module-level guard exactly as test/tick.test.ts's race test does.
    const first = runTick({
      sources: [blocked],
      priority: ["lectio", "github"],
      invokeAgent: async () => {},
      boardDir: dir,
    });
    // Default tick (the REAL prBoardTick) through the MCP client, mid-flight:
    const client = await connect((s) => registerTriggerTickTool(s, stubRuntime()));
    const result = await client.callTool({ name: "trigger_tick", arguments: {} });
    expect(result.isError).toBeFalsy();
    expect((result.structuredContent as { result: string }).result).toBe("skipped_overlap");
    release();
    expect(await first).toBe("all_clear"); // the guard-holding tick completes normally
  });

  it("maps a thrown misconfiguration (lectioEnv) to isError with the message", async () => {
    delete process.env.LECTIO_URL;
    delete process.env.LECTIO_TOKEN;
    const client = await connect((s) => registerTriggerTickTool(s, stubRuntime()));
    const result = await client.callTool({ name: "trigger_tick", arguments: {} });
    expect(result.isError).toBe(true);
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].text).toMatch(/LECTIO_URL/);
  });
});
