/**
 * Cross-isolate tick lease policy (bead:canonical-hours-25ff14).
 *
 * `runTick`'s own overlap guard is a module-scope flag, so it protects only
 * against concurrency *within one isolate*. Cloudflare dispatches concurrent
 * requests across many isolates, where each one sees its own unset flag — so
 * two `/tick` calls can both proceed. The guard on the Durable Object that
 * owns the board closes that gap, because a DO is single-threaded per object
 * id and its check-and-set is therefore atomic across every isolate.
 *
 * The decision lives here, apart from the DO method, for two reasons: it is
 * the part with the edge cases worth testing, and `worker/index.ts` imports
 * `cloudflare:workers`, which cannot be loaded by the node test runner.
 */

/**
 * Is a lease currently held?
 *
 * `leaseUntil` is the stored expiry (epoch ms), or `undefined` when no lease
 * has been taken. An expiry at or before `nowMs` counts as free: a holder that
 * died mid-tick can never release, and a lease that outlived its holder would
 * convert an overlap bug into a permanent stall — strictly the worse failure.
 */
export function leaseIsHeld(nowMs: number, leaseUntil: number | undefined): boolean {
  return leaseUntil !== undefined && leaseUntil > nowMs;
}

/**
 * How long a tick may hold the lease before it is presumed dead.
 *
 * Long enough to cover a slow tick (several source fetches plus a model
 * invocation), short enough that a crashed holder does not block the next
 * scheduled run for long.
 */
export const TICK_LEASE_MS = 5 * 60_000;
