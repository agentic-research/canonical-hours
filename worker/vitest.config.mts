import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [
    cloudflareTest({
      main: "./index.ts",
      miniflare: {
        compatibilityDate: "2026-03-01",
        durableObjects: {
          CH_BOARD: "CanonicalHoursBoardObject",
        },
      },
    }),
  ],
  test: {
    include: ["test/**/*.test.ts"],
  },
});
