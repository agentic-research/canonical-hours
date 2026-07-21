import {
  Artifact,
  LifecycleEvent,
  LifecycleState,
  Observation,
} from "./source";

export interface MergedArtifact {
  artifact: Artifact;
  observations: Observation[];
  state: LifecycleState;
}

/** Activity by others that can leave something outstanding on you. */
const OTHER_ACTIVITY = new Set([
  "review",
  "review_approved",
  "review_changes_requested",
  "review_commented",
  "review_comment", // lectio's normalized github/review_comment kind (agent/sources/lectio.ts KIND_MAP)
  "comment",
]);

/**
 * Fold one artifact's observations into a single lifecycle state.
 * Rule order matters; hard observations win state transitions, soft only enrich.
 */
export function foldState(observations: Observation[], hints: LifecycleState[]): LifecycleState {
  const sorted = [...observations].sort((a, b) => a.at.localeCompare(b.at));

  // 1. Hard terminal events.
  if (sorted.some((o) => o.classification === "hard" && (o.type === "merge" || o.type === "close"))) {
    return "resolved";
  }

  // 2. Standing changes_requested (hard, not superseded by a later approval).
  const verdicts = sorted.filter(
    (o) =>
      o.classification === "hard" &&
      (o.type === "review_approved" || o.type === "review_changes_requested"),
  );
  const lastVerdict = verdicts[verdicts.length - 1];
  if (lastVerdict?.type === "review_changes_requested") return "needs_you";

  // 3. Unanswered activity from others (a bare approval needs no reply).
  const lastOther = [...sorted].reverse().find((o) => OTHER_ACTIVITY.has(o.type));
  const lastOwn = [...sorted].reverse().find((o) => o.type === "own_reply");
  const unanswered =
    lastOther !== undefined && (lastOwn === undefined || lastOther.at > lastOwn.at);
  // Value equality, not reference identity: lastOther and lastVerdict run different
  // predicates (OTHER_ACTIVITY membership vs. classification === "hard"), so a hard
  // review_approved and a same-instant soft duplicate of it are two distinct object
  // instances that must still be recognized as the same logical event (test/merge.test.ts).
  const isSameObservation = lastOther && lastVerdict && lastOther.at === lastVerdict.at && lastOther.type === lastVerdict.type;
  if (unanswered && !isSameObservation) return "needs_you";
  if (hints.includes("needs_you")) return "needs_you";

  // 4. Approved with nothing outstanding.
  if (lastVerdict?.type === "review_approved") return "resolved";

  // 5. Others engaged / conversation exists.
  if (lastOther || lastOwn) return "active";

  // 6. Any activity (even if soft) exists but didn't trigger above rules → active
  if (sorted.length > 0) return "active";

  return "opened";
}

function obsKey(o: Observation): string {
  return `${o.artifact_uri}|${o.at}|${o.author}`;
}

/**
 * Merge per-source lifecycle events under the priority policy (spec §2.2a):
 * dedupe by canonical artifact URI; the earlier source in `priority` wins a
 * duplicated observation, EXCEPT a hard observation always replaces a soft one.
 * Policy lives here, not in the adapters — a third source is additive.
 */
export function mergeEvents(
  eventsBySource: Record<string, LifecycleEvent[]>,
  priority: string[],
): MergedArtifact[] {
  const ordered = [
    ...priority,
    ...Object.keys(eventsBySource).filter((s) => !priority.includes(s)),
  ];
  const entries = new Map<
    string,
    { artifact: Artifact; observations: Map<string, Observation>; hints: LifecycleState[] }
  >();

  for (const sourceName of ordered) {
    for (const event of eventsBySource[sourceName] ?? []) {
      const uri = event.artifact.uri;
      let entry = entries.get(uri);
      if (!entry) {
        entry = { artifact: event.artifact, observations: new Map(), hints: [] };
        entries.set(uri, entry);
      }
      if (event.state_hint) entry.hints.push(event.state_hint);
      for (const obs of event.observations) {
        const key = obsKey(obs);
        const existing = entry.observations.get(key);
        if (!existing) {
          entry.observations.set(key, obs);
        } else if (existing.classification === "soft" && obs.classification === "hard") {
          entry.observations.set(key, obs); // hard beats soft, even from a lower-priority source
        }
      }
    }
  }

  return [...entries.values()].map((e) => {
    const observations = [...e.observations.values()].sort((a, b) => a.at.localeCompare(b.at));
    return { artifact: e.artifact, observations, state: foldState(observations, e.hints) };
  });
}
