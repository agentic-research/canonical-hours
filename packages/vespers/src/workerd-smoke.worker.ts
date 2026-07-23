/**
 * Trivial worker entry — @cloudflare/vitest-pool-workers' `main` option
 * requires SOME worker module to exist, even though this package has no
 * real HTTP surface of its own (it's a library, not a deployable worker).
 * The actual portability proof lives in test-workerd/portability.test.ts,
 * which imports @agentic-research/vespers-core's exports directly inside the simulated
 * workerd runtime this file's presence unlocks.
 */
export default {
  async fetch(): Promise<Response> {
    return new Response("vespers workerd smoke worker — not a real endpoint");
  },
};
