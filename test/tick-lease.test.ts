import { describe, expect, it } from "vitest";
import { leaseIsHeld, TICK_LEASE_MS } from "../agent/lib/tick-lease";

/**
 * The lease exists because runTick's own guard is a module-scope flag and so
 * is per-isolate. These cover the decision the Durable Object makes; the DO
 * method itself is a thin wrapper (read stored expiry -> ask -> put), and
 * worker/index.ts cannot be imported here because it pulls in
 * `cloudflare:workers`. (bead:canonical-hours-25ff14.)
 */
describe("tick lease", () => {
  it("is free when no lease has ever been taken", () => {
    expect(leaseIsHeld(1_000, undefined)).toBe(false);
  });

  it("is held while a live tick owns it", () => {
    expect(leaseIsHeld(1_000, 61_000)).toBe(true);
  });

  it("frees itself once the expiry passes, so a dead holder cannot wedge it", () => {
    // The failure this prevents is worse than the one it fixes: a lease that
    // outlives an evicted isolate would stall every future tick forever.
    expect(leaseIsHeld(61_001, 61_000)).toBe(false);
  });

  it("treats an expiry exactly at now as free", () => {
    // Boundary: `>` not `>=`. At the instant of expiry the holder's TTL is
    // spent, so the next caller must be allowed through rather than waiting
    // a further tick interval.
    expect(leaseIsHeld(61_000, 61_000)).toBe(false);
  });

  it("survives a clock that jumped backwards", () => {
    // If the stored expiry is far in the future relative to a rewound clock,
    // the lease reads as held — correct, and self-healing once time catches
    // up, rather than granting two concurrent ticks.
    expect(leaseIsHeld(0, 10 * TICK_LEASE_MS)).toBe(true);
  });

  it("gives a tick enough room to finish a slow run", () => {
    // Sources + a model invocation. Too short and a healthy tick loses its
    // own lease mid-run, letting a second one start alongside it — which is
    // exactly the overlap this is meant to prevent.
    expect(TICK_LEASE_MS).toBeGreaterThanOrEqual(60_000);
  });
});
