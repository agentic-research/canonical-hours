import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import mcpChannel, {
  registerGetBoardTool,
  registerTriggerTickTool,
  registerResolveThreadsTool,
  registerDismissBotReviewsTool,
} from "../agent/channels/mcp";
import * as threadResolution from "../agent/lib/thread-resolution";
import * as botReviewDismissal from "../agent/lib/bot-review-dismissal";
import { Board, BoardSchema, renderBoardMd, writeBoardAtomic } from "../agent/lib/board";
import { runTick, _resetTickGuardForTests } from "../agent/lib/tick";
import type { InvokeAgentRuntime } from "../agent/lib/invoke-agent";
import type { LifecycleEvent, Source } from "../agent/lib/sources/source";

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
  items: [
    {
      kind: "pr",
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
    expect(parsed.items[0].summary).toBe("Mark commented.");
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
    // Dummy env so the real lectio source (used inside prBoardTick, not the fake
    // "blocked" source below) doesn't add a spurious degradation entry that would
    // complicate this test's assertions; nothing is ever actually fetched from it
    // — the guard rejects before any source I/O.
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

  it("missing LECTIO_URL/TOKEN degrades lectio gracefully instead of crashing the tick", async () => {
    delete process.env.LECTIO_URL;
    delete process.env.LECTIO_TOKEN;
    const client = await connect((s) => registerTriggerTickTool(s, stubRuntime()));
    const result = await client.callTool({ name: "trigger_tick", arguments: {} });
    expect(result.isError).toBeFalsy();
    const sc = result.structuredContent as { result: string };
    expect(["all_clear", "degraded_fallback", "material", "material_unchanged"]).toContain(sc.result);
  });
});

describe("resolve_addressed_review_threads tool", () => {
  afterEach(() => vi.restoreAllMocks());

  it("parses the pr input and delegates to resolveAddressedThreads with the right ref", async () => {
    const spy = vi
      .spyOn(threadResolution, "resolveAddressedThreads")
      .mockResolvedValue({ resolved: ["t1"], skipped: [], failed: [] });
    const client = await connect(registerResolveThreadsTool);
    const result = await client.callTool({ name: "resolve_addressed_review_threads", arguments: { pr: "o/r#1" } });
    expect(result.isError).toBeFalsy();
    expect(spy).toHaveBeenCalledWith({ owner: "o", repo: "r", number: 1 }, expect.any(String), fetch);
    expect(result.structuredContent).toEqual({ resolved: ["t1"], skipped: [], failed: [] });
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].text).toBe("resolved 1, skipped 0, failed 0");
  });

  it("returns isError on an invalid pr reference (never touches the network)", async () => {
    const spy = vi.spyOn(threadResolution, "resolveAddressedThreads");
    const client = await connect(registerResolveThreadsTool);
    const result = await client.callTool({ name: "resolve_addressed_review_threads", arguments: { pr: "not a pr" } });
    expect(result.isError).toBe(true);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("dismiss_stale_bot_reviews tool", () => {
  afterEach(() => vi.restoreAllMocks());

  it("parses the pr input and delegates to dismissStaleBotReviews with the right ref", async () => {
    const spy = vi
      .spyOn(botReviewDismissal, "dismissStaleBotReviews")
      .mockResolvedValue({ dismissed: ["r1"], skipped: [], failed: [] });
    const client = await connect(registerDismissBotReviewsTool);
    const result = await client.callTool({ name: "dismiss_stale_bot_reviews", arguments: { pr: "o/r#1" } });
    expect(result.isError).toBeFalsy();
    expect(spy).toHaveBeenCalledWith({ owner: "o", repo: "r", number: 1 }, expect.any(String), fetch);
    expect(result.structuredContent).toEqual({ dismissed: ["r1"], skipped: [], failed: [] });
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].text).toBe("dismissed 1, skipped 0, failed 0");
  });

  it("returns isError on an invalid pr reference (never touches the network)", async () => {
    const spy = vi.spyOn(botReviewDismissal, "dismissStaleBotReviews");
    const client = await connect(registerDismissBotReviewsTool);
    const result = await client.callTool({ name: "dismiss_stale_bot_reviews", arguments: { pr: "not a pr" } });
    expect(result.isError).toBe(true);
    expect(spy).not.toHaveBeenCalled();
  });
});

/** Pull an HTTP route handler off the channel's public `routes` (eve's Channel type). */
function routeHandler(method: "GET" | "POST"): (req: Request, args: unknown) => Promise<Response> {
  const route = mcpChannel.routes.find((r) => r.method === method && r.path === "/mcp");
  if (!route) throw new Error(`no ${method} /mcp route`);
  return route.handler as (req: Request, args: unknown) => Promise<Response>;
}

/** Minimal RouteHandlerArgs stand-in: only `receive` is ever consumed, and only on the material path. */
function stubRouteArgs(): unknown {
  return {
    send: async () => {
      throw new Error("send not expected");
    },
    cancel: async () => {
      throw new Error("cancel not expected");
    },
    getSession: () => {
      throw new Error("getSession not expected");
    },
    receive: async () => {
      throw new Error("receive not expected in these tests");
    },
    params: {},
    waitUntil: () => {},
    requestIp: null,
  };
}

describe("mcp channel routes", () => {
  it("GET /mcp returns 405 (no SSE stream in stateless JSON mode)", async () => {
    const response = await routeHandler("GET")(
      new Request("http://localhost/mcp"),
      stubRouteArgs(),
    );
    expect(response.status).toBe(405);
  });

  it("POST /mcp answers a JSON-RPC initialize with a JSON response", async () => {
    const response = await routeHandler("POST")(
      new Request("http://localhost/mcp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-06-18",
            capabilities: {},
            clientInfo: { name: "probe", version: "0.0.0" },
          },
        }),
      }),
      stubRouteArgs(),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    const body = (await response.json()) as {
      jsonrpc: string;
      result: { serverInfo: { name: string } };
    };
    expect(body.jsonrpc).toBe("2.0");
    expect(body.result.serverInfo.name).toBe("canonical-hours");
  });
});

/**
 * Minimal node:http adapter (spec §5): Node request → web-standard Request →
 * the channel's own route handler → Response → Node response. Ephemeral port
 * via listen(0) — works identically on macOS (dev) and Linux (deploy/CI).
 */
async function startHarness(): Promise<{ url: string; close: () => Promise<void> }> {
  const post = routeHandler("POST");
  const get = routeHandler("GET");
  const server = createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const body = Buffer.concat(chunks);
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === "string") headers.set(k, v);
      else if (Array.isArray(v)) for (const item of v) headers.append(k, item);
    }
    const request = new Request(`http://127.0.0.1${req.url ?? "/"}`, {
      method: req.method,
      headers,
      body: body.length > 0 ? body : undefined,
    });
    const handler = req.method === "POST" ? post : get;
    const response = await handler(request, stubRouteArgs());
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (typeof address !== "object" || address === null) throw new Error("no server address");
  return {
    url: `http://127.0.0.1:${address.port}/mcp`,
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      }),
  };
}

async function connectHttpClient(url: string): Promise<Client> {
  const client = new Client({ name: "mcp-e2e-test", version: "0.0.0" });
  await client.connect(new StreamableHTTPClientTransport(new URL(url)));
  return client;
}

describe("e2e: real SDK client over streamable-HTTP", () => {
  beforeEach(() => _resetTickGuardForTests());

  it("initialize succeeds; tools/list returns all four tools with schemas", async () => {
    const harness = await startHarness();
    const client = await connectHttpClient(harness.url);
    try {
      const tools = await client.listTools();
      expect(tools.tools.map((t) => t.name).sort()).toEqual([
        "dismiss_stale_bot_reviews",
        "get_board",
        "resolve_addressed_review_threads",
        "trigger_tick",
      ]);
      for (const tool of tools.tools) {
        expect(tool.inputSchema).toBeDefined();
        expect(tool.outputSchema).toBeDefined();
      }
    } finally {
      await client.close();
      await harness.close();
    }
  });

  it("get_board end-to-end: BoardSchema-valid structured content + renderBoardMd text; null when empty", async () => {
    const harness = await startHarness();
    try {
      const written = await useFixtureBoard();
      const client = await connectHttpClient(harness.url);
      const result = await client.callTool({ name: "get_board", arguments: {} });
      expect(result.isError).toBeFalsy();
      const parsed = BoardSchema.parse((result.structuredContent as { board: unknown }).board);
      expect(parsed.material_hash).toBe(written.material_hash);
      expect((result.content as Array<{ text: string }>)[0].text).toBe(renderBoardMd(written));
      await client.close();

      process.env.BOARD_DIR = await mkdtemp(join(tmpdir(), "mcp-e2e-empty-"));
      const client2 = await connectHttpClient(harness.url);
      const empty = await client2.callTool({ name: "get_board", arguments: {} });
      expect(empty.isError).toBeFalsy();
      expect((empty.structuredContent as { board: unknown }).board).toBeNull();
      await client2.close();
    } finally {
      await harness.close();
    }
  });

  it("trigger_tick racing an in-flight tick returns skipped_overlap through the full HTTP stack", async () => {
    process.env.LECTIO_URL = "http://127.0.0.1:1/mcp"; // never contacted
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
    const dir = await mkdtemp(join(tmpdir(), "mcp-e2e-tick-"));
    const first = runTick({
      sources: [blocked],
      priority: ["lectio", "github"],
      invokeAgent: async () => {},
      boardDir: dir,
    });
    const harness = await startHarness();
    const client = await connectHttpClient(harness.url);
    try {
      const result = await client.callTool({ name: "trigger_tick", arguments: {} });
      expect(result.isError).toBeFalsy();
      expect((result.structuredContent as { result: string }).result).toBe("skipped_overlap");
    } finally {
      release();
      expect(await first).toBe("all_clear");
      await client.close();
      await harness.close();
    }
  });

  it("trigger_tick with LECTIO env unset degrades lectio gracefully through the full HTTP stack", async () => {
    delete process.env.LECTIO_URL;
    delete process.env.LECTIO_TOKEN;
    const harness = await startHarness();
    const client = await connectHttpClient(harness.url);
    try {
      const result = await client.callTool({ name: "trigger_tick", arguments: {} });
      expect(result.isError).toBeFalsy();
      const sc = result.structuredContent as { result: string };
      expect(["all_clear", "degraded_fallback", "material", "material_unchanged"]).toContain(sc.result);
    } finally {
      await client.close();
      await harness.close();
    }
  });
});
