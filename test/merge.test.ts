import { describe, it, expect } from "vitest";
import { mergeEvents, foldState } from "../agent/sources/merge";
import { Artifact, LifecycleEvent, Observation } from "../agent/sources/source";

const artifact = (uri: string): Artifact => ({
  uri, kind: "pr", repo: uri.slice(3, uri.indexOf("#")),
  number: Number(uri.slice(uri.indexOf("#") + 1)),
  title: "t", url: "https://example.com",
});

const obs = (partial: Partial<Observation>): Observation => ({
  artifact_uri: "pr:o/r#1", at: "2026-07-16T12:00:00Z", author: "mark",
  type: "comment", payload: {}, classification: "hard", ...partial,
});

const event = (uri: string, observations: Observation[], hint?: LifecycleEvent["state_hint"]): LifecycleEvent => ({
  artifact: artifact(uri), observations, state_hint: hint,
});

const issueArtifact = (uri: string): Artifact => {
  const [team, identifier] = uri.slice("issue:".length).split("/");
  return { uri, kind: "issue", team, identifier, title: "t", url: "https://linear.app/x" };
};

const issueEvent = (
  uri: string,
  observations: Observation[],
  hint?: LifecycleEvent["state_hint"],
  extra?: LifecycleEvent["extra"],
): LifecycleEvent => ({ artifact: issueArtifact(uri), observations, state_hint: hint, extra });

describe("foldState", () => {
  it("hard merge/close wins everything → resolved", () => {
    expect(foldState([obs({ type: "merge" })], [])).toBe("resolved");
    expect(foldState([obs({ type: "close" })], [])).toBe("resolved");
  });

  it("a SOFT merge does not resolve — hard observations win state transitions", () => {
    expect(foldState([obs({ type: "merge", classification: "soft" })], [])).toBe("active");
  });

  it("standing changes_requested → needs_you, even after own reply", () => {
    const o = [
      obs({ type: "review_changes_requested", at: "2026-07-16T12:00:00Z" }),
      obs({ type: "own_reply", author: "me", at: "2026-07-16T13:00:00Z" }),
    ];
    expect(foldState(o, [])).toBe("needs_you");
  });

  it("changes_requested superseded by later approval → resolved", () => {
    const o = [
      obs({ type: "review_changes_requested", at: "2026-07-16T12:00:00Z" }),
      obs({ type: "review_approved", at: "2026-07-16T14:00:00Z" }),
    ];
    expect(foldState(o, [])).toBe("resolved");
  });

  it("unanswered comment → needs_you; answered → active", () => {
    const comment = obs({ type: "comment", at: "2026-07-16T12:00:00Z" });
    expect(foldState([comment], [])).toBe("needs_you");
    const reply = obs({ type: "own_reply", author: "me", at: "2026-07-16T13:00:00Z" });
    expect(foldState([comment, reply], [])).toBe("active");
  });

  it("hint needs_you (backstop) applies when nothing else fires", () => {
    const reply = obs({ type: "own_reply", author: "me" });
    expect(foldState([obs({ type: "comment", at: "2026-07-16T11:00:00Z" }), reply], ["needs_you"])).toBe("needs_you");
  });

  it("no observations, no hints → opened", () => {
    expect(foldState([], [])).toBe("opened");
  });

  it("lectio-only standalone review_comment (no accompanying review row) → needs_you, not active", () => {
    // Regression test: agent/sources/lectio.ts normalizes github/review_comment
    // to "review_comment", but merge.ts's OTHER_ACTIVITY set didn't originally
    // include that string (only GitHub's own "review_commented" token and
    // "comment"). A PR whose only lectio-visible signal was an inline review
    // comment would fold to "active" instead of "needs_you" — under-flagging
    // the unanswered-comment case this whole system exists to catch.
    const reviewComment = obs({ type: "review_comment", classification: "soft", at: "2026-07-16T12:00:00Z" });
    expect(foldState([reviewComment], [])).toBe("needs_you");
  });

  it("hard approval + a same-instant soft duplicate (distinct object instances) folds to resolved, not needs_you", () => {
    // Regression test for the reference-identity bug (Task 5 finding), replacing
    // two earlier "clone safety" tests that didn't actually exercise it (proven by
    // reverting the fix and re-running them — both still passed, see
    // canonical-hours-f325c3). Cloning the whole input array before calling
    // foldState doesn't cause lastOther/lastVerdict to diverge in reference,
    // because both are derived from elements of that SAME cloned array.
    //
    // The real divergence: lastOther (OTHER_ACTIVITY membership, ignores
    // classification) and lastVerdict (classification === "hard" only) run
    // DIFFERENT predicates over the same sorted array. If the same real-world
    // review_approved event is represented by two SEPARATE object instances at
    // the same `at` — a soft duplicate alongside the hard verdict, which
    // upstream sources can produce before mergeEvents' dedup Map ever runs —
    // lastOther can select the soft instance while lastVerdict selects the hard
    // one. Reference equality (the pre-fix check) then wrongly treats this as
    // unanswered "other activity" (needs_you) for what is really just a bare
    // approval; value equality (at + type) correctly recognizes them as the
    // same logical event.
    const at = "2026-07-16T14:00:00Z";
    const hardApproval = obs({ type: "review_approved", classification: "hard", at });
    const softDuplicate = obs({ type: "review_approved", classification: "soft", at });
    expect(hardApproval).not.toBe(softDuplicate); // genuinely distinct object instances
    expect(foldState([hardApproval, softDuplicate], [])).toBe("resolved");
  });
});

describe("mergeEvents", () => {
  it("dedupes by canonical URI, lectio's copy preferred", () => {
    const lectio = [event("pr:o/r#1", [obs({ payload: { preview: "lectio copy" } })])];
    const github = [event("pr:o/r#1", [obs({ payload: { preview: "gh copy" } })])];
    const merged = mergeEvents({ lectio, github }, ["lectio", "github"]);
    expect(merged).toHaveLength(1);
    expect(merged[0].observations).toHaveLength(1);
    expect(merged[0].observations[0].payload.preview).toBe("lectio copy");
  });

  it("hard beats soft for the same observation key, regardless of priority", () => {
    const lectio = [event("pr:o/r#1", [obs({ classification: "soft", payload: { preview: "soft" } })])];
    const github = [event("pr:o/r#1", [obs({ classification: "hard", payload: { preview: "hard" } })])];
    const merged = mergeEvents({ lectio, github }, ["lectio", "github"]);
    expect(merged[0].observations[0].classification).toBe("hard");
    expect(merged[0].observations[0].payload.preview).toBe("hard");
  });

  it("gh fills coverage gaps (artifact only gh knows about)", () => {
    const lectio = [event("pr:o/r#1", [obs({})])];
    const github = [event("pr:o/other#2", [obs({ artifact_uri: "pr:o/other#2" })])];
    const merged = mergeEvents({ lectio, github }, ["lectio", "github"]);
    expect(merged.map((m) => m.artifact.uri).sort()).toEqual(["pr:o/other#2", "pr:o/r#1"]);
  });

  it("folds each artifact to one state and sorts observations by time", () => {
    const events = [
      event("pr:o/r#1", [
        obs({ type: "own_reply", author: "me", at: "2026-07-16T13:00:00Z" }),
        obs({ type: "comment", at: "2026-07-16T12:00:00Z" }),
      ]),
    ];
    const merged = mergeEvents({ github: events }, ["lectio", "github"]);
    expect(merged[0].state).toBe("active");
    expect(merged[0].observations[0].type).toBe("comment");
  });

  it("carries a source's `extra` through to the merged artifact", () => {
    const github = [event("pr:o/r#1", [obs({})])];
    github[0].extra = { merge_ready: true };
    const merged = mergeEvents({ github }, ["lectio", "github"]);
    expect(merged[0].extra).toEqual({ merge_ready: true });
  });

  it("higher-priority source's extra keys win on conflict", () => {
    const lectio = [event("pr:o/r#1", [obs({})])];
    lectio[0].extra = { merge_ready: false };
    const github = [event("pr:o/r#1", [obs({ author: "other" })])];
    github[0].extra = { merge_ready: true };
    const merged = mergeEvents({ lectio, github }, ["lectio", "github"]);
    expect(merged[0].extra).toEqual({ merge_ready: false });
  });

  it("an issue-kind artifact with a needs_you state_hint and no observations folds to needs_you (LinearSource's staleness-only case)", () => {
    const events = [issueEvent("issue:art/art-1", [], "needs_you", { reason: "P1 stuck in Triage for 9d" })];
    const merged = mergeEvents({ linear: events }, ["lectio", "github", "linear"]);
    expect(merged).toHaveLength(1);
    expect(merged[0].artifact.kind).toBe("issue");
    expect(merged[0].state).toBe("needs_you");
    expect(merged[0].extra).toEqual({ reason: "P1 stuck in Triage for 9d" });
  });

  it("an issue-kind artifact with a hard close observation folds to resolved (LinearSource's completed/canceled case) — zero new foldState code required", () => {
    const closeObs: Observation = {
      artifact_uri: "issue:art/art-2", at: "2026-07-21T10:00:00Z", author: "",
      type: "close", payload: {}, classification: "hard",
    };
    const events = [issueEvent("issue:art/art-2", [closeObs])];
    const merged = mergeEvents({ linear: events }, ["lectio", "github", "linear"]);
    expect(merged[0].state).toBe("resolved");
  });

  it("issue and pr artifacts coexist in the same mergeEvents call, each folding independently", () => {
    const prEvents = [event("pr:o/r#1", [obs({ type: "merge" })])];
    const linearEvents = [issueEvent("issue:art/art-3", [], "needs_you", { reason: "In Todo, untouched 31d — done elsewhere?" })];
    const merged = mergeEvents({ github: prEvents, linear: linearEvents }, ["lectio", "github", "linear"]);
    expect(merged).toHaveLength(2);
    const pr = merged.find((m) => m.artifact.kind === "pr")!;
    const issue = merged.find((m) => m.artifact.kind === "issue")!;
    expect(pr.state).toBe("resolved");
    expect(issue.state).toBe("needs_you");
  });
});
