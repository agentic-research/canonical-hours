/// <reference types="@cloudflare/vitest-pool-workers/types" />

import { SELF, env, runInDurableObject } from "cloudflare:test";
import { parseConfig } from "@agentic-research/vespers-core";
import { describe, expect, it } from "vitest";
import { buildSources } from "../index";
import { signedDpopActionRequest } from "./dpop-fixture";

const MCP_URL = "https://canonical-hours.test/mcp";

function mcpToolCall(name: string, args: Record<string, unknown> = {}): Request {
  return new Request(MCP_URL, {
    method: "POST",
    body: JSON.stringify({ jsonrpc: "2.0", id: name, method: "tools/call", params: { name, arguments: args } }),
  });
}

async function mcpText(response: Response): Promise<string | undefined> {
  const body = await response.json() as { result?: { content?: Array<{ text?: string }> } };
  return body.result?.content?.[0]?.text;
}

describe("canonical-hours worker host", () => {
  it("allows exactly one concurrent HTTP use of a signed DPoP proof", async () => {
    const request = await signedDpopActionRequest();
    const responses = await Promise.all([SELF.fetch(request.clone()), SELF.fetch(request.clone())]);
    const messages = await Promise.all(responses.map(mcpText));
    expect(messages.filter((message) => message === "GITHUB_TOKEN is not configured")).toHaveLength(1);
    expect(messages.filter((message) => message?.includes("DPoP proof replay"))).toHaveLength(1);
    const ledgerBinding = (env as typeof env & {
      CH_DPOP_LEDGER: {
        idFromName(name: string): DurableObjectId;
        get(id: DurableObjectId): DurableObjectStub;
      };
    }).CH_DPOP_LEDGER;
    const replayRows = await runInDurableObject(
      ledgerBinding.get(ledgerBinding.idFromName("default")),
      (_instance, state) => state.storage.sql.exec("SELECT COUNT(*) AS count FROM dpop_jti_ledger").one(),
    );
    expect(replayRows?.count).toBe(1);
  });

  it("records one of two concurrent uses of the same proof jti", async () => {
    const ledgerBinding = (env as typeof env & {
      CH_DPOP_LEDGER: {
        idFromName(name: string): DurableObjectId;
        get(id: DurableObjectId): DurableObjectStub;
      };
    }).CH_DPOP_LEDGER;
    const ledger = ledgerBinding.get(ledgerBinding.idFromName("direct-ledger-test"));
    const request = () => ledger.fetch("https://canonical-hours-dpop-ledger.test/jti", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jti: "concurrent-proof-jti" }),
    });
    const results = await Promise.all([request(), request()]);
    expect(results.map((response) => response.status)).toEqual([200, 200]);
    const seen = await Promise.all(results.map(async (response) => (await response.json() as { seen: boolean }).seen));
    expect(seen.sort()).toEqual([false, true]);
  });

  it("advertises the same MCP tools as the Eve host", async () => {
    const res = await SELF.fetch("https://canonical-hours.test/mcp", {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
      }),
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      result?: { tools?: Array<{ name?: string }> };
    };
    expect(json.result?.tools?.map((tool) => tool.name).sort()).toEqual([
      "dismiss_stale_bot_reviews",
      "get_board",
      "resolve_addressed_review_threads",
      "trigger_tick",
    ]);
  });

  it("denies mutating MCP tools without a DPoP proof", async () => {
    for (const name of ["resolve_addressed_review_threads", "dismiss_stale_bot_reviews"]) {
      const res = await SELF.fetch(mcpToolCall(name, { pr: "agentic-research/canonical-hours#1" }));

      expect(res.status).toBe(200);
      expect(await mcpText(res)).toContain("missing Authorization: DPoP");
    }
  });

  it("serves board routes and MCP tick locally in workerd", async () => {
    expect(await SELF.fetch("https://canonical-hours.test/board")).toMatchObject({ status: 404 });

    const tick = await SELF.fetch(mcpToolCall("trigger_tick"));
    expect(tick.status).toBe(200);
    const tickJson = (await tick.json()) as {
      result?: { structuredContent?: { result?: string } };
    };
    expect(tickJson.result?.structuredContent?.result).toBe("all_clear");

    const board = await SELF.fetch("https://canonical-hours.test/board");
    expect(board.status).toBe(200);
    const boardJson = (await board.json()) as { tick_status?: string; items?: unknown[] };
    expect(boardJson.tick_status).toBe("all_clear");
    expect(boardJson.items).toEqual([]);

    const md = await SELF.fetch("https://canonical-hours.test/board/md");
    expect(md.status).toBe(200);
    expect(await md.text()).toContain("All clear");
  });

  it("can build and exercise provider adapters with Worker-injected dependencies", async () => {
    const calls: Array<{ url: string; init?: RequestInit; lectioTool?: string }> = [];
    const fetchImpl: typeof fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();
      calls.push({ url, init });

      if (url === "https://api.github.com/graphql") {
        return Response.json({
          data: {
            rateLimit: { remaining: 999, resetAt: "2099-01-01T00:00:00Z" },
            viewer: { login: "james" },
            search: { nodes: [] },
          },
        });
      }
      if (url === "https://api.linear.app/graphql") {
        return Response.json({ data: { issues: { nodes: [] } } });
      }
      if (url.startsWith("https://api.openweathermap.org/data/2.5/weather")) {
        return Response.json({
          weather: [{ description: "clear sky" }],
          main: { temp: 71.2, feels_like: 70.8, humidity: 25 },
          dt: 1_800_000_000,
        });
      }
      return new Response("unexpected URL", { status: 500 });
    }) as typeof fetch;

    const config = parseConfig({
      github: { min_remaining: 200 },
      linear: {
        team: "AR",
        user_email: "james@example.com",
        triage_stale_days: 1,
        triage_abandoned_days: 14,
        todo_stale_days: 7,
      },
      weather: { location: "Denver,US" },
    });
    const { sources, snapshotSources } = buildSources(
      {
        GITHUB_TOKEN: "gh-token",
        LECTIO_URL: "https://lectio.example/mcp",
        LECTIO_TOKEN: "lectio-token",
        LINEAR_API_KEY: "linear-token",
        WEATHER_API_KEY: "weather-token",
        WEATHER_LOCATION: "Denver,US",
      },
      config,
      {
        fetchImpl,
        lectioCallFactory: (url, token) => {
          expect(url).toBe("https://lectio.example/mcp");
          expect(token).toBe("lectio-token");
          return async (tool) => {
            calls.push({ url: "lectio://mcp", lectioTool: tool });
            return tool === "memory_list_sources"
              ? { sources: [{ last_observed_at_iso: "2026-07-24T00:00:00.000Z" }] }
              : { prs: [] };
          };
        },
        now: () => new Date("2026-07-24T00:00:00.000Z"),
      },
    );

    expect(sources.map((source) => source.name)).toEqual(["lectio", "github", "linear"]);
    expect(snapshotSources.map((source) => source.name)).toEqual(["weather"]);

    const window = {
      since: new Date("2026-07-23T00:00:00.000Z"),
      until: new Date("2026-07-24T00:00:00.000Z"),
    };
    for (const source of sources) await source.fetch(window);
    await snapshotSources[0]!.fetch();

    expect(calls.map((call) => call.url)).toContain("lectio://mcp");
    expect(calls.map((call) => call.url)).toContain("https://api.github.com/graphql");
    expect(calls.map((call) => call.url)).toContain("https://api.linear.app/graphql");
    expect(calls.some((call) => call.url.includes("appid=weather-token"))).toBe(true);
    const githubCall = calls.find((call) => call.url === "https://api.github.com/graphql");
    expect((githubCall?.init?.headers as Record<string, string>).Authorization).toBe("Bearer gh-token");
    const linearCall = calls.find((call) => call.url === "https://api.linear.app/graphql");
    expect((linearCall?.init?.headers as Record<string, string>).Authorization).toBe("linear-token");
  });
});
