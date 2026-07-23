import { defineMcpClientConnection } from "eve/connections";
import { optionalConnectionUrl } from "../lib/optional-connection-url";

/**
 * Pure transport: MCP wiring to the lectio daemon (spec §2.2).
 * The default export registers the connection with eve (inline server
 * config), used by the agent for enrichment (memory_search / memory_traverse).
 * The deterministic tick's own LectioSource (agent/lib/tick-entry.ts) reads
 * LECTIO_URL/LECTIO_TOKEN directly with an empty-string fallback, matching
 * every other source — lectio being unset/unreachable surfaces as a `lectio`
 * degradation on the board, never a crash.
 *
 * THIS connection needed the same "unset = off" treatment separately: eve
 * validates a connection's `url` field at discovery/build time (a different,
 * earlier layer than the tick's own lazy degradation), and an empty string
 * fails that check outright — confirmed live, this crashed the whole
 * `eve dev`/`eve build` when LECTIO_URL was unset, before the tick's own
 * graceful-degradation logic ever got a chance to matter. optionalConnectionUrl
 * substitutes a syntactically-valid, never-real placeholder so registration
 * succeeds; an agent that actually tries to call a lectio tool on an
 * unconfigured setup gets a normal connection-refused tool error, not a
 * boot-time crash.
 */
const lectioServerConfig = defineMcpClientConnection({
  url: optionalConnectionUrl(process.env.LECTIO_URL),
  description:
    "lectio observational memory: authored PR/issue activity and cross-source timeline for the agent's own contributions.",
  headers: {
    "x-lectio-token": process.env.LECTIO_TOKEN ?? "",
  },
});

export default lectioServerConfig;
