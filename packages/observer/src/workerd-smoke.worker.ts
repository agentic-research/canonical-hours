/**
 * Library-only Worker entry used by @cloudflare/vitest-pool-workers.
 *
 * The portability tests import observer-core directly inside the simulated
 * workerd runtime; this entry only gives Miniflare a module to boot.
 */
export default {
  async fetch(): Promise<Response> {
    return new Response("observer-core workerd smoke worker");
  },
};
