/// <reference types="@cloudflare/vitest-pool-workers/types" />

import { SELF } from "cloudflare:test";
import { parseConfig } from "@agentic-research/vespers-core";
import { describe, expect, it } from "vitest";
import { buildSources } from "../index";

describe("canonical-hours worker host", () => {
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

  it("default-denies mutating MCP tools when no action auth is configured", async () => {
    for (const name of ["resolve_addressed_review_threads", "dismiss_stale_bot_reviews"]) {
      const res = await SELF.fetch("https://canonical-hours.test/mcp", {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: name,
          method: "tools/call",
          params: { name, arguments: { pr: "agentic-research/canonical-hours#1" } },
        }),
      });

      expect(res.status).toBe(200);
      const json = (await res.json()) as {
        result?: { isError?: boolean; content?: Array<{ text?: string }> };
      };
      expect(json.result?.isError).toBe(true);
      expect(json.result?.content?.[0]?.text).toContain("default-deny");
    }
  });

  it("serves board routes and MCP tick locally in workerd", async () => {
    expect(await SELF.fetch("https://canonical-hours.test/board")).toMatchObject({ status: 404 });

    const tick = await SELF.fetch("https://canonical-hours.test/mcp", {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "trigger_tick", arguments: {} },
      }),
    });
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
