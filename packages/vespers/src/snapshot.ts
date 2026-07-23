import { z } from "zod";

/**
 * One current-value reading. Generic on purpose: weather today, but any
 * "what is X right now" source later (stock quote, CI queue depth, on-call
 * status) fits this shape without changing it. No Artifact, no Observation,
 * no lifecycle — snapshots never enter mergeEvents/foldState.
 */
export const SnapshotValueSchema = z.object({
  kind: z.string().min(1),   // e.g. "weather" — the source's own vocabulary, not an enum
  label: z.string().min(1),  // human heading, e.g. "Weather — Austin, TX"
  value: z.string().min(1),  // the reading, e.g. "72°F, clear"
  detail: z.string().optional(), // e.g. "feels like 75°F, wind 8 mph SSE"
  as_of: z.string().min(1),  // ISO 8601 — when the value was true at the provider
});
export type SnapshotValue = z.infer<typeof SnapshotValueSchema>;

/**
 * The snapshot counterpart to Source (source.ts). Deliberately smaller: no
 * window (current value only), no mapToLifecycleEvent (no lifecycle), no
 * per-record schema field (the adapter zod-parses its provider response
 * internally and throws loudly on drift, same failure philosophy).
 * Genuinely generic — proven by a real second consumer (weather), unlike
 * Source (still PR-shaped, v1-only). A second snapshot source is a
 * registry entry in canonical-hours' tick-entry.ts, not a rewrite.
 */
export interface SnapshotSource {
  /** Registry key; also the name used in freshness/degradations entries. */
  name: string;
  /** Current value. Throws loudly on provider/schema failure → that source's degradation. */
  fetch(): Promise<SnapshotValue>;
  /** ISO timestamp the source's data last advanced, or null if unknown. */
  freshness(): Promise<string | null>;
}
