import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

// The package is a library, but the Workers pool requires a bootable module.
// The tests import observer-core directly inside this simulated runtime.
export default defineConfig({
  plugins: [
    cloudflareTest({
      main: "./src/workerd-smoke.worker.ts",
      miniflare: {
        compatibilityDate: "2026-03-01",
      },
    }),
  ],
  test: {
    include: ["test-workerd/**/*.test.ts"],
  },
});
