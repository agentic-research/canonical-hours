// Import names confirmed via local docs inspection (docs/eve-api-notes.md
// fact 4: node_modules/eve/docs/sandbox.mdx + eve's package.json exports
// map). `defineSandbox` and `defaultBackend` live on `eve/sandbox`; the
// pinned backend factories are named exports of their own nested subpaths
// (`docker` from `eve/sandbox/docker`, `vercel` from `eve/sandbox/vercel`),
// not `dockerBackend`/`vercelBackend`.
//
// Structure is fixed: selection by env, never hardcoded (spec §2.2 —
// portability). `agent/sandbox.ts` (the shorthand layout, no seeded
// workspace files) is the correct location per sandbox.mdx: "Use it when
// you need only a definition, no seeded files."
import { defineSandbox, defaultBackend } from "eve/sandbox";
import { docker } from "eve/sandbox/docker";
import { vercel } from "eve/sandbox/vercel";

/**
 * Sandbox backend selection (spec §2.2): env-driven, never hardcoded.
 * - SANDBOX_BACKEND=docker → Docker daemon (steve's fly.io deployment path).
 * - SANDBOX_BACKEND=vercel → Vercel Sandbox (Vercel-hosted deployment path).
 * - Unset, or SANDBOX_BACKEND=auto (the default) → eve's own
 *   availability-aware defaultBackend(): Vercel Sandbox when deploying on
 *   Vercel, else a reachable Docker daemon, else microsandbox, else
 *   just-bash.
 */
export function selectBackend() {
  switch (process.env.SANDBOX_BACKEND) {
    case "docker":
      return docker();
    case "vercel":
      return vercel();
    default:
      return defaultBackend();
  }
}

export default defineSandbox({ backend: selectBackend() });
