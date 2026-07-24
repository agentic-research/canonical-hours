import { DurableObject } from "cloudflare:workers";
import {
  Board,
  BoardSchema,
  BoardStore,
  Config,
  TickResult,
  parseConfig,
  renderBoardMd,
  runTick,
} from "@agentic-research/vespers-core";
import type { SnapshotSource, Source } from "@agentic-research/vespers-core";
import { GithubSource } from "../agent/lib/sources/github";
import { LectioSource, createMcpLectioCall, type LectioCall } from "../agent/lib/sources/lectio";
import { LinearSource } from "../agent/lib/sources/linear";
import { WeatherSource } from "../agent/lib/sources/weather";
import { actionGateFromEnv, type HeaderLookup } from "../agent/lib/action-gate";
import { dismissStaleBotReviews } from "../agent/lib/bot-review-dismissal";
import { parsePrRef } from "../agent/lib/pr-ref";
import { resolveAddressedThreads } from "../agent/lib/thread-resolution";

interface Env {
  CH_BOARD: DurableObjectNamespace<CanonicalHoursBoardObject>;
  CANONICAL_HOURS_CONFIG_JSON?: string;
  GITHUB_TOKEN?: string;
  GITHUB_MIN_REMAINING?: string;
  LECTIO_URL?: string;
  LECTIO_TOKEN?: string;
  LINEAR_API_KEY?: string;
  LINEAR_USER_EMAIL?: string;
  LINEAR_TEAM?: string;
  WEATHER_API_KEY?: string;
  WEATHER_LOCATION?: string;
  QUIET_HOURS?: string;
  QUIET_TZ?: string;
  MCP_ACTION_TOKEN?: string;
  NOTME_URL?: string;
  NOTME_AUDIENCE?: string;
  NOTME_ISSUER?: string;
  NOTME_REQUIRED_SCOPE?: string;
}

function json(value: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(value), { ...init, headers });
}

function text(value: string, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "text/plain; charset=utf-8");
  return new Response(value, { ...init, headers });
}

function parsePositiveInt(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function configFromEnv(env: Env): Config {
  const parsed = env.CANONICAL_HOURS_CONFIG_JSON?.trim()
    ? JSON.parse(env.CANONICAL_HOURS_CONFIG_JSON)
    : {
        github: { min_remaining: parsePositiveInt(env.GITHUB_MIN_REMAINING) ?? 200 },
        ...(env.WEATHER_LOCATION ? { weather: { location: env.WEATHER_LOCATION } } : {}),
        ...(env.LINEAR_USER_EMAIL
          ? {
              linear: {
                team: env.LINEAR_TEAM ?? "default",
                user_email: env.LINEAR_USER_EMAIL,
              },
            }
          : {}),
      };
  return parseConfig(parsed);
}

class DurableObjectBoardStore implements BoardStore {
  constructor(private readonly env: Env) {}

  private stub(): DurableObjectStub<CanonicalHoursBoardObject> {
    return this.env.CH_BOARD.get(this.env.CH_BOARD.idFromName("default"));
  }

  async write(board: Board): Promise<void> {
    const res = await this.stub().fetch("https://canonical-hours-board.local/board", {
      method: "PUT",
      body: JSON.stringify(board),
    });
    if (!res.ok) throw new Error(`board store write failed: ${res.status}`);
  }

  async read(): Promise<Board | null> {
    const res = await this.stub().fetch("https://canonical-hours-board.local/board");
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`board store read failed: ${res.status}`);
    return BoardSchema.parse(await res.json());
  }
}

interface WorkerSourceDeps {
  fetchImpl?: typeof fetch;
  lectioCallFactory?: (url: string, token: string) => LectioCall;
  now?: () => Date;
}

export function buildSources(
  env: Omit<Env, "CH_BOARD">,
  config: Config,
  deps: WorkerSourceDeps = {},
): { sources: Source[]; snapshotSources: SnapshotSource[] } {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const lectioCallFactory = deps.lectioCallFactory ?? createMcpLectioCall;
  const now = deps.now ?? (() => new Date());
  const sources: Source[] = [];
  const snapshotSources: SnapshotSource[] = [];

  if (env.LECTIO_URL?.trim()) {
    sources.push(new LectioSource(lectioCallFactory(env.LECTIO_URL, env.LECTIO_TOKEN ?? "")));
  }
  if (env.GITHUB_TOKEN?.trim()) {
    sources.push(new GithubSource(env.GITHUB_TOKEN, fetchImpl, now, config.github.min_remaining));
  }
  if (env.LINEAR_API_KEY?.trim() && config.linear) {
    sources.push(
      new LinearSource(env.LINEAR_API_KEY, config.linear.user_email, {
        triageStaleDays: config.linear.triage_stale_days,
        triageAbandonedDays: config.linear.triage_abandoned_days,
        todoStaleDays: config.linear.todo_stale_days,
      }, fetchImpl, now),
    );
  }
  if (env.WEATHER_API_KEY?.trim() && config.weather) {
    snapshotSources.push(new WeatherSource(env.WEATHER_API_KEY, config.weather.location, fetchImpl));
  }

  return { sources, snapshotSources };
}

async function triggerTick(env: Env): Promise<TickResult> {
  const config = configFromEnv(env);
  const { sources, snapshotSources } = buildSources(env, config);
  return runTick({
    sources,
    priority: ["lectio", "github", "linear"],
    snapshotSources,
    boardStore: new DurableObjectBoardStore(env),
    quietHours: env.QUIET_HOURS,
    quietTz: env.QUIET_TZ,
    invokeAgent: async (input) => {
      const now = new Date().toISOString();
      await new DurableObjectBoardStore(env).write({
        generated_at: now,
        tick_status: input.degradations.length > 0 ? "degraded" : "ok",
        window: input.window,
        freshness: input.freshness,
        degradations: input.degradations,
        items: input.merged.map((m) => {
          if (m.artifact.kind === "pr") {
            return {
              kind: "pr",
              artifact_uri: m.artifact.uri,
              repo: m.artifact.repo,
              number: m.artifact.number,
              title: m.artifact.title,
              url: m.artifact.url,
              state: m.state,
              reason: "worker no-model fold",
              new_items: [],
            };
          }
          return {
            kind: "issue",
            artifact_uri: m.artifact.uri,
            team: m.artifact.team,
            identifier: m.artifact.identifier,
            title: m.artifact.title,
            url: m.artifact.url,
            state: m.state,
            reason: "worker no-model fold",
            new_items: [],
          };
        }),
      });
    },
  });
}

function headersFromRequest(headers: Headers): HeaderLookup {
  const out: HeaderLookup = {};
  headers.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

function gateUrl(url: URL): string {
  return `${url.origin}${url.pathname}`;
}

function mcpToolText(id: string | number | null | undefined, textValue: string, structuredContent?: unknown): Response {
  return json({
    jsonrpc: "2.0",
    id: id ?? null,
    result: {
      content: [{ type: "text", text: textValue }],
      ...(structuredContent === undefined ? {} : { structuredContent }),
    },
  });
}

function mcpToolError(id: string | number | null | undefined, textValue: string): Response {
  return json({
    jsonrpc: "2.0",
    id: id ?? null,
    result: {
      content: [{ type: "text", text: textValue }],
      isError: true,
    },
  });
}

function stringArg(args: Record<string, unknown> | undefined, name: string): string | undefined {
  const value = args?.[name];
  return typeof value === "string" ? value : undefined;
}

async function handleResolveAddressedReviewThreads(
  req: Request,
  env: Env,
  id: string | number | null | undefined,
  args: Record<string, unknown> | undefined,
): Promise<Response> {
  const verdict = await actionGateFromEnv(env)({
    toolName: "resolve_addressed_review_threads",
    headers: headersFromRequest(req.headers),
    url: gateUrl(new URL(req.url)),
  });
  if (!verdict.allowed) return mcpToolError(id, `denied: ${verdict.reason}`);

  const pr = stringArg(args, "pr");
  if (!pr) return mcpToolError(id, 'invalid input: "pr" must be a string');
  if (!env.GITHUB_TOKEN?.trim()) return mcpToolError(id, "GITHUB_TOKEN is not configured");

  try {
    const result = await resolveAddressedThreads(parsePrRef(pr), env.GITHUB_TOKEN, fetch);
    return mcpToolText(
      id,
      `resolved ${result.resolved.length}, skipped ${result.skipped.length}, failed ${result.failed.length}`,
      { ...result },
    );
  } catch (err) {
    return mcpToolError(id, err instanceof Error ? err.message : String(err));
  }
}

async function handleDismissStaleBotReviews(
  req: Request,
  env: Env,
  id: string | number | null | undefined,
  args: Record<string, unknown> | undefined,
): Promise<Response> {
  const verdict = await actionGateFromEnv(env)({
    toolName: "dismiss_stale_bot_reviews",
    headers: headersFromRequest(req.headers),
    url: gateUrl(new URL(req.url)),
  });
  if (!verdict.allowed) return mcpToolError(id, `denied: ${verdict.reason}`);

  const pr = stringArg(args, "pr");
  if (!pr) return mcpToolError(id, 'invalid input: "pr" must be a string');
  if (!env.GITHUB_TOKEN?.trim()) return mcpToolError(id, "GITHUB_TOKEN is not configured");

  try {
    const result = await dismissStaleBotReviews(parsePrRef(pr), env.GITHUB_TOKEN, fetch);
    return mcpToolText(
      id,
      `dismissed ${result.dismissed.length}, skipped ${result.skipped.length}, failed ${result.failed.length}`,
      { ...result },
    );
  } catch (err) {
    return mcpToolError(id, err instanceof Error ? err.message : String(err));
  }
}

async function handleMcp(req: Request, env: Env): Promise<Response> {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  const body = (await req.json()) as {
    jsonrpc?: string;
    id?: string | number | null;
    method?: string;
    params?: { name?: string; arguments?: Record<string, unknown> };
  };

  if (body.method === "tools/list") {
    return json({
      jsonrpc: "2.0",
      id: body.id ?? null,
      result: {
        tools: [
          {
            name: "get_board",
            description: "Read the current canonical-hours board.",
            inputSchema: { type: "object", properties: {} },
          },
          {
            name: "trigger_tick",
            description: "Run one no-model canonical-hours tick in workerd.",
            inputSchema: { type: "object", properties: {} },
          },
          {
            name: "resolve_addressed_review_threads",
            description:
              "Resolve unresolved GitHub PR review threads whose file changed after the originating review. Mutates GitHub and requires action auth.",
            inputSchema: {
              type: "object",
              properties: { pr: { type: "string" } },
              required: ["pr"],
            },
          },
          {
            name: "dismiss_stale_bot_reviews",
            description:
              "Dismiss stale CHANGES_REQUESTED reviews from bot accounts after a later fix commit. Mutates GitHub and requires action auth.",
            inputSchema: {
              type: "object",
              properties: { pr: { type: "string" } },
              required: ["pr"],
            },
          },
        ],
      },
    });
  }

  if (body.method !== "tools/call") {
    return json({ jsonrpc: "2.0", id: body.id ?? null, error: { code: -32601, message: "method not found" } });
  }

  const boardStore = new DurableObjectBoardStore(env);
  if (body.params?.name === "get_board") {
    const board = await boardStore.read();
    return json({
      jsonrpc: "2.0",
      id: body.id ?? null,
      result: {
        content: [{ type: "text", text: board ? renderBoardMd(board) : "No board yet -- no tick has completed." }],
        structuredContent: { board },
      },
    });
  }
  if (body.params?.name === "trigger_tick") {
    const result = await triggerTick(env);
    return json({
      jsonrpc: "2.0",
      id: body.id ?? null,
      result: {
        content: [{ type: "text", text: `tick result: ${result}` }],
        structuredContent: { result },
      },
    });
  }
  if (body.params?.name === "resolve_addressed_review_threads") {
    return handleResolveAddressedReviewThreads(req, env, body.id, body.params.arguments);
  }
  if (body.params?.name === "dismiss_stale_bot_reviews") {
    return handleDismissStaleBotReviews(req, env, body.id, body.params.arguments);
  }

  return json({
    jsonrpc: "2.0",
    id: body.id ?? null,
    error: { code: -32602, message: `unknown tool: ${body.params?.name ?? ""}` },
  });
}

async function handleRequest(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const boardStore = new DurableObjectBoardStore(env);

  if (url.pathname === "/health") return text("ok\n");
  if (url.pathname === "/mcp") return handleMcp(req, env);
  if (req.method === "GET" && url.pathname === "/board") {
    const board = await boardStore.read();
    return board ? json(board) : json({ error: "board not found" }, { status: 404 });
  }
  if (req.method === "GET" && url.pathname === "/board/md") {
    const board = await boardStore.read();
    return board ? text(renderBoardMd(board)) : text("No board yet -- no tick has completed.\n", { status: 404 });
  }
  if (req.method === "POST" && url.pathname === "/tick") {
    return json({ result: await triggerTick(env) });
  }

  return new Response(null, { status: 404 });
}

export class CanonicalHoursBoardObject extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname !== "/board") return new Response(null, { status: 404 });
    if (req.method === "GET") {
      const board = await this.ctx.storage.get<Board>("board");
      return board ? json(BoardSchema.parse(board)) : json({ error: "board not found" }, { status: 404 });
    }
    if (req.method === "PUT") {
      const board = BoardSchema.parse(await req.json());
      await this.ctx.storage.put("board", board);
      return json({ ok: true });
    }
    return new Response(null, { status: 405 });
  }
}

export default {
  fetch: handleRequest,
} satisfies ExportedHandler<Env>;
