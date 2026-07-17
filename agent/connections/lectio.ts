import { defineMcpClientConnection } from "eve/connections";

/**
 * Pure transport: MCP wiring to the lectio daemon (spec §2.2).
 * - The default export registers the connection with eve (inline server config),
 *   used by the agent for enrichment (memory_search / memory_traverse).
 * - lectioEnv() is reused by the deterministic tick's own MCP client.
 * Failures surface through the lectio source adapter as a degradation.
 */
export function lectioEnv(): { url: string; token: string } {
  const url = process.env.LECTIO_URL;
  const token = process.env.LECTIO_TOKEN;
  if (!url || !token) {
    throw new Error("LECTIO_URL and LECTIO_TOKEN must be set");
  }
  return { url, token };
}

/**
 * Field names confirmed via local docs inspection (docs/eve-api-notes.md fact 4:
 * node_modules/eve/docs/connections/mcp.mdx). There is no `type` discriminator
 * field — connection kind is selected by calling `defineMcpClientConnection`
 * (vs. `defineOpenAPIConnection`), not by a `type` property. Auth uses the
 * lectio shared-secret token via the `x-lectio-token` header (constant-time
 * compared server-side) rather than a Bearer `Authorization` header.
 */
const lectioServerConfig = defineMcpClientConnection({
  url: process.env.LECTIO_URL ?? "",
  description:
    "lectio observational memory: authored PR/issue activity and cross-source timeline for the agent's own contributions.",
  headers: {
    "x-lectio-token": process.env.LECTIO_TOKEN ?? "",
  },
});

export default lectioServerConfig;
