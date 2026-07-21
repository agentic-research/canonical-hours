import { z } from "zod";
import type { FetchWindow } from "@canonical-hours/core";

export const LIFECYCLE_STATES = ["opened", "active", "needs_you", "resolved"] as const;
export const LifecycleStateSchema = z.enum(LIFECYCLE_STATES);
export type LifecycleState = z.infer<typeof LifecycleStateSchema>;

/** Board sort order: needs_you first; resolved renders as a footnote. */
export const LIFECYCLE_SORT_ORDER: Record<LifecycleState, number> = {
  needs_you: 0,
  active: 1,
  opened: 2,
  resolved: 3,
};

/** hard = provider ground truth (verdicts, merge/close). soft = derived/heuristic (enrichments, previews, summaries). */
export const ClassificationSchema = z.enum(["hard", "soft"]);
export type Classification = z.infer<typeof ClassificationSchema>;

export const ArtifactSchema = z.object({
  uri: z.string().min(1),          // canonical, e.g. "pr:owner/repo#123"
  kind: z.literal("pr"),           // v1: the only kind
  repo: z.string().min(1),         // "owner/repo", lowercased
  number: z.number().int().positive(),
  title: z.string(),
  url: z.string(),
});
export type Artifact = z.infer<typeof ArtifactSchema>;

export const ObservationSchema = z.object({
  artifact_uri: z.string().min(1),
  at: z.string().min(1),           // ISO 8601
  author: z.string(),
  // Canonical vocabulary consumed by foldState (Task 5):
  // review_approved | review_changes_requested | review_commented | review |
  // review_comment | comment | own_reply | merge | close | check_failed |
  // enrichment | (source-specific passthrough)
  type: z.string(),
  payload: z.record(z.string(), z.unknown()),
  classification: ClassificationSchema,
});
export type Observation = z.infer<typeof ObservationSchema>;

export const LifecycleEventSchema = z.object({
  artifact: ArtifactSchema,
  observations: z.array(ObservationSchema),
  state_hint: LifecycleStateSchema.optional(),
});
export type LifecycleEvent = z.infer<typeof LifecycleEventSchema>;

export function canonicalPrUri(owner: string, repo: string, number: number): string {
  return `pr:${owner.toLowerCase()}/${repo.toLowerCase()}#${number}`;
}

/**
 * The local Source protocol (spec §2.2a). Local to this repo by design —
 * not a cross-project protocol. lectio and GitHub are the two v1
 * implementations; a third source is a registry entry, not a rewrite.
 */
export interface Source {
  /** Registry key; also the name used in freshness/degradations entries. */
  name: string;
  /** Zod schema for ONE raw provider record. Parsed at the adapter boundary; drift fails loudly as that source's degradation. */
  schema: z.ZodType;
  /** Raw records for the lookback window, plus any stateless current-state records (e.g. the GitHub open-PRs backstop). */
  fetch(window: FetchWindow): Promise<unknown[]>;
  /** Normalize one raw record (parsing it with `schema` internally) into a lifecycle event. Throws (loudly) on schema drift. */
  mapToLifecycleEvent(raw: unknown): LifecycleEvent;
  /** ISO timestamp the source's data last advanced, or null if unknown. */
  freshness(): Promise<string | null>;
}
