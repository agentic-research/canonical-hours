import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [
    cloudflareTest({
      wrangler: {
        configPath: "./wrangler.toml",
      },
      miniflare: {
        bindings: {
          NOTME_URL: "https://notme.test",
          NOTME_AUDIENCE: "canonical-hours",
          NOTME_ISSUER: "https://notme.test",
        },
        outboundService: async (request) => {
          const url = new URL(request.url);
          if (url.origin === "https://notme.test" && url.pathname === "/.well-known/jwks.json") {
            return Response.json({
              keys: [{
                kty: "OKP",
                crv: "Ed25519",
                x: "q8_bmUwVjCrdQmoSC9UtCOpRaItgZ23ctfVZJXpe1Ss",
                alg: "EdDSA",
                kid: "worker-dpop-test-key",
                use: "sig",
              }],
            });
          }
          return new Response("unexpected outbound request", { status: 500 });
        },
      },
    }),
  ],
  test: {
    include: ["test/**/*.test.ts"],
  },
});
