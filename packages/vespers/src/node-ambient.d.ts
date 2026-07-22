/**
 * Minimal ambient declarations for the one intentional Node API tick.ts
 * uses (createHash for computeMaterialHash's sha256 hash, process.env for
 * quiet-hours config) — scoped narrowly so this file's existence doesn't
 * reopen the door to arbitrary node: imports elsewhere in this package.
 * Workerd's nodejs_compat flag is expected to provide a real node:crypto
 * at runtime (verified live by Task 8's workerd smoke test, not assumed
 * here) — this file only satisfies the TYPE checker, it has zero runtime
 * effect.
 */
declare module "node:crypto" {
  export function createHash(algorithm: string): {
    update(data: string): { digest(encoding: "hex"): string };
  };
}

declare const process: { env: Record<string, string | undefined> };
