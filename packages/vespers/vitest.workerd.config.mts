import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

// pool-workers v4 API (0.18.x): the pool is a Vite plugin, `cloudflareTest`,
// taking what used to be `test.poolOptions.workers` as its argument — not
// the old `defineWorkersProject` from the removed `/config` subpath
// (confirmed live against notme's own real Workers deployment, worker/vitest.workers.config.mts).
export default defineConfig({
  plugins: [
    cloudflareTest({
      main: "./src/workerd-smoke.worker.ts",
      miniflare: {
        compatibilityDate: "2026-03-01",
        // node:crypto's createHash (used by computeMaterialHash, tick.ts) is
        // the one risk flagged in the design spec. This flag documents that
        // intent, but it is NOT what actually unlocks node:crypto here:
        // @cloudflare/vitest-pool-workers@0.18.7 unconditionally force-pushes
        // nodejs_compat_v2 (plus nodejs_fs_module/nodejs_http_modules/etc.)
        // onto the test runner regardless of this array — confirmed
        // empirically (removing this flag entirely still passes) and by
        // reading the pool's own source (dist/pool/index.mjs's
        // getNodeCompat() call). So this test proves createHash works under
        // Miniflare's pool-enforced compat mode — a real, still-valuable
        // proof — but it does NOT prove canonical-hours' own eventual
        // wrangler.toml/deployment compat config (whatever flags THAT sets)
        // will have node:crypto available; that's a separate, still-open
        // question for whenever a real workerd deployment exists.
        compatibilityFlags: ["nodejs_compat"],
      },
    }),
  ],
  test: {
    include: ["test-workerd/**/*.test.ts"],
  },
});
