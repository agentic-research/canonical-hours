/**
 * The lookback window an activity-fold Source's fetch() is asked to cover.
 * Plain interface, not a zod schema: constructed internally by the tick
 * (agent/lib/tick.ts), never parsed from untrusted external input — zod in
 * this codebase validates at trust boundaries (provider responses), not
 * every internal value.
 */
export interface FetchWindow {
  since: Date;
  until: Date;
}
