import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Source } from "@vespers/core";

/**
 * Loads the optional private-sources module (canonical-hours-dfb779):
 * sensitive personal data sources (e.g. interview tracking) don't belong
 * in this public repo. `path`, when set, points at a *built* dist/index.js
 * (see jamestexas/canonical-hours-private's README) exporting a
 * `sources: Source[]` array. Same "absence is a valid state, no
 * degradation" convention as every other optional source (undefined path
 * → `[]`, no log). Unlike the others, a *configured but broken* path IS
 * logged (not silently swallowed) — that's a real misconfiguration, not a
 * feature that's simply off — but it still never throws.
 */
export async function loadPrivateSources(
  path: string | undefined,
  importModule: (specifier: string) => Promise<unknown> = (s) => import(s),
): Promise<Source[]> {
  if (!path) return [];
  try {
    const mod = await importModule(pathToFileURL(resolve(path)).href);
    const sources = (mod as { sources?: unknown }).sources;
    if (Array.isArray(sources)) return sources as Source[];
    console.error(`[pr-board] CANONICAL_HOURS_PRIVATE_SOURCES_PATH module has no \`sources\` array export: ${path}`);
    return [];
  } catch (err) {
    console.error(`[pr-board] failed to load CANONICAL_HOURS_PRIVATE_SOURCES_PATH (${path}): ${err}`);
    return [];
  }
}
