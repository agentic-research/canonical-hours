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
        // the one risk flagged in the design spec — this flag is exactly
        // what canonical-hours would need in a real workerd deployment, so
        // the smoke test must run WITH it to mean anything; running
        // without it would prove nothing about the real risk.
        compatibilityFlags: ["nodejs_compat"],
      },
    }),
  ],
  test: {
    include: ["test-workerd/**/*.test.ts"],
  },
});
