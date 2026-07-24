/// <reference types="@cloudflare/vitest-pool-workers/types" />

import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("canonical-hours worker host", () => {
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
});
