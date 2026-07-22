import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const serverJson = JSON.parse(readFileSync("server.json", "utf8"));
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

describe("server.json (cloister registry document)", () => {
  it("parses, names the server, and tracks package.json's version", () => {
    expect(serverJson.name).toBe("io.github.agentic-research/canonical-hours");
    expect(serverJson.version).toBe(pkg.version);
    expect(serverJson.title).toBe("canonical-hours");
  });

  it("declares one streamable-http remote at /mcp with an overridable port defaulting to 2000", () => {
    expect(serverJson.remotes).toHaveLength(1);
    const remote = serverJson.remotes[0];
    expect(remote.type).toBe("streamable-http");
    expect(remote.url.endsWith("/mcp")).toBe(true);
    expect(remote.variables.port.default).toBe("2000");
  });

  it("declares external/untrusted tenancy", () => {
    const meta = serverJson._meta["art.cloister/v1"];
    expect(meta.tenancy).toEqual({
      default_mode: "external",
      trusted_tier: false,
      shares_workerd_with: [],
    });
  });

  // canonical-hours-f17ca7: cloister's resolver (scripts/resolve-inputs.mjs
  // parseServerJsonMeta) rejects a dynamicTools=true backend with both an
  // empty handlesPrefix AND an empty claims set (ADR-0006/cloister-8ede3f)
  // — confirmed live against a real `wrangler dev` boot, not assumed. A
  // single group with no advertisedPrefix is the "no partitioning" shape
  // (one backend, bare tool names), not a real multi-group split — but
  // groups[] with real upstreamNames is required either way, so there's no
  // longer a "no groups" state to assert.
  it("declares its four tools as one unprefixed cloister resolver group", () => {
    const meta = serverJson._meta["art.cloister/v1"];
    expect(meta.groups).toHaveLength(1);
    const [group] = meta.groups;
    expect(group.name).toBe("canonical-hours");
    expect(group.advertisedPrefix).toBe("");
    expect(group.upstreamNames.sort()).toEqual(
      ["get_board", "trigger_tick", "resolve_addressed_review_threads", "dismiss_stale_bot_reviews"].sort(),
    );
  });
});
