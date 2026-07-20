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

  it("declares external/untrusted tenancy and no groups partitioning", () => {
    const meta = serverJson._meta["art.cloister/v1"];
    expect(meta.tenancy).toEqual({
      default_mode: "external",
      trusted_tier: false,
      shares_workerd_with: [],
    });
    expect("groups" in meta).toBe(false);
  });
});
