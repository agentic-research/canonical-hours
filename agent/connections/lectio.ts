import { defineMcpClientConnection } from "eve/connections";

/**
 * Pure transport: MCP wiring to the lectio daemon (spec §2.2).
 * The default export registers the connection with eve (inline server
 * config), used by the agent for enrichment (memory_search / memory_traverse).
 * The deterministic tick's own LectioSource (agent/lib/tick-entry.ts) reads
 * LECTIO_URL/LECTIO_TOKEN directly with an empty-string fallback, matching
 * every other source — lectio being unset/unreachable surfaces as a `lectio`
 * degradation on the board, never a crash.
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
