/**
 * A syntactically-valid placeholder URL for an eve connection whose `url`
 * field requires *some* valid URL shape at registration time, even when the
 * real integration is unconfigured (canonical-hours-<TBD>). eve validates
 * connection `url` fields at discovery/build time — confirmed live: an
 * empty string fails with "Expected the connection export ... to match the
 * public eve shape. The 'url' field must be a valid URL", crashing the
 * whole `eve dev`/`eve build`, regardless of whether the connection is ever
 * actually invoked. This is a different, earlier validation layer than
 * `defineMcpClientConnection` itself (which only validates the `auth`
 * shape) — the deterministic tick's own "empty-string fallback, degrade
 * lazily inside fetch()" convention doesn't apply here, because eve's own
 * connection registration runs at build/discovery time, not lazily.
 *
 * The placeholder never resolves to anything real — using it is a
 * deliberate "this connection exists but is unconfigured" marker, not a
 * real target. If the agent ever actually calls a tool on an unconfigured
 * connection, the resulting request fails at the network layer (connection
 * refused), a normal tool-call error the agent can recover from — never a
 * boot-time crash.
 */
export function optionalConnectionUrl(configured: string | undefined): string {
  return configured && configured.length > 0 ? configured : "http://localhost:1/not-configured";
}
