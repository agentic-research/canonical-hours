# lectio API notes

lectio (the daemon this project's `LECTIO_URL`/`LECTIO_TOKEN` point at) is a
separate, privately-maintained project — these notes describe the observed
shape of its MCP tool responses, confirmed against its source and one live
call at authoring time, not sourced from public docs. Not captured against
*this project's specific* `LECTIO_URL` instance (no reachable token for that
instance at authoring time) — treat the shapes below as source-verified but
re-confirm end-to-end against the real deploy target before Task 9/11 wire
this up for real.

These are the facts Task 3 (`agent/lib/sources/lectio.ts`) depends on, and that
Tasks 4/5/9/11 should read before touching lectio-sourced data.

## 1. `memory_authored_activity` returns a single envelope, not a bare array

```json
{
  "since_nanos_used": 1784016000000000000,
  "prs_with_activity": 1,
  "total_new_items": 2,
  "prs": [ /* see §2 */ ],
  "authored_commits": [ /* git/commit entries, unrelated to PR lifecycle */ ],
  "authored_commit_count": 0
}
```

The adapter's `fetch()` (`agent/lib/sources/lectio.ts`) reads `result.prs` — it is
**not** a bare array of records, and it is **not** `{ records: [...] }`.

## 2. Tool args: `since_nanos` + `authors` only — no `until`

The tool accepts `since_nanos` (defaults server-side to now - 7 days) and an
optional `authors` list. There is no window-end parameter at all — the query
is always "since X, through now" server-side. Passing `until` is simply
ignored (unknown fields are not rejected by the MCP tool's arg deserializer,
but there is nothing on the server that reads it). `agent/lib/sources/lectio.ts`'s
`fetch()` only sends `since_nanos`.

`since_nanos` as a JS `number` loses precision above 2^53 (~9.007e15) —
current nanosecond epoch values are ~1.78e18, well past that boundary. The
adapter accepts the resulting sub-microsecond imprecision on the *outgoing*
since-filter (harmless for a window-start bound); *incoming* `observed_at_nanos`
values are divided down to milliseconds before conversion, which stays well
within safe-integer range.

## 3. One `prs[]` entry — PR metadata, no `url`, `merged` is a string

```json
{
  "uri": "gh://owner/repo/pr/42",
  "repo": "owner/repo",
  "number": 42,
  "title": "...",
  "state": "Open",
  "merged": "false",
  "new_items": [ /* see §4 */ ]
}
```

- **No `url` field exists anywhere in this chain.** The underlying PR metadata
  stores `title`, `state`, `merged`, `merged_at`, `author`, `updated_at` —
  never a GitHub URL. `agent/lib/sources/lectio.ts`
  synthesizes `Artifact.url` as `` `https://github.com/${repo}/pull/${number}` ``
  rather than reading one off the record.
- **`state` is a Rust enum's `Debug`-formatted value** — PascalCase
  (`"Open"`, `"Closed"`), not lowercase or a custom enum string. Task 2's
  `Artifact` schema (`agent/lib/sources/source.ts`) has no PR-state field at
  all — this adapter doesn't currently forward `state` anywhere (see §6,
  Task 2 wasn't changed for this).
- **`merged` is the literal string `"true"`/`"false"`**, not a JSON boolean —
  lectio's adapter metadata store is a string-only map throughout, so every
  metadata value round-trips through this daemon as a string even when the
  underlying value was a bool. Like `state`, this adapter parses `merged` in
  the raw schema (`LectioPrRecordSchema.merged: z.string().nullable()`)
  but doesn't currently forward it into `Artifact` — no field exists for it.

## 4. `new_items[]` — kind is an artifact kind, never a review verdict

```json
{
  "uri": "gh://owner/repo/pr/42/review/1001",
  "kind": "github/review",
  "author": "mark",
  "path": null,
  "preview": "Please split this function.",
  "observed_at_nanos": 1784210400000000000
}
```

`kind` is always either `"github/review"` or `"github/review_comment"` — the
lectio *artifact* kind, not the review's verdict. **This is the load-bearing
fact for classification:** lectio's underlying `gh` adapter *does* capture a
review's verdict when it ingests the review (values like `"Approved"` /
`"ChangesRequested"` / `"Commented"`) — but the `new_items` projection this
tool exposes only carries `author`, `path`, `preview`, and
`observed_at_nanos` through. **The verdict never reaches
`memory_authored_activity`'s response.** There is no lectio-only way to tell
"approved" from "changes requested" from "commented" — only "a review
happened" vs. "an inline comment happened."

**Design consequence (confirmed with the plan owner, not just inferred):**
lectio is the soft/enrichment source; GitHub (Task 4's `sources/github.ts`)
is the hard-verdict source. Review verdicts and merge/close events are
classified `hard` there, from GitHub's own API (which does return verdict).
`agent/lib/sources/lectio.ts`'s `classifyLectioKind()` is therefore a constant
function — every lectio-sourced observation is `soft`, and
`mapToLifecycleEvent()` never sets `state_hint` beyond `"active"` (never
`"needs_you"` or `"resolved"` on lectio's word alone). This isn't a
workaround for a data gap — it's what lectio was always supposed to provide
per the design doc; the brief's original fixture (assuming
`review_changes_requested`-style hard kinds from lectio) didn't match that
design.

If verdict-level lectio classification is ever wanted, it requires an
upstream lectio change, not a workaround here.

## 5. `memory_list_sources` — nested `sources[]`, not `{name, last_advanced_at}[]`

```json
{
  "coverage": { "gh_repos": [...], "linear_workspace": null, "...": "..." },
  "sources": [
    {
      "source_id": "gh",
      "label": "github",
      "uri_prefixes": ["gh://"],
      "observation_count": 128,
      "ingest_capability": "Full",
      "first_observed_at_iso": "2026-01-05T09:00:00Z",
      "last_observed_at_iso": "2026-07-17T06:00:00Z"
    }
  ]
}
```

`agent/lib/sources/lectio.ts`'s `freshness()` reads `result.sources[].last_observed_at_iso`
(max across all entries), not `result[].last_advanced_at`.

## 6. What was *not* changed

Task 2's `agent/lib/sources/source.ts` (`Artifact`, `Observation`,
`LifecycleEvent`, `LifecycleStateSchema`) was left untouched. `state` and
`merged` from the real lectio record are parsed (typed correctly) in
`LectioPrRecordSchema` but not forwarded anywhere — there's no field on
`Artifact` for PR-level open/closed/merged state in the v1 protocol, and
`state_hint` is deliberately capped at `"active"` for lectio per §4. This
didn't require a Task 2 schema change; it's a mapping choice inside this
adapter. If a future task wants PR state surfaced through the board (e.g. to
show "merged" distinctly from "open"), that's a Task 2 protocol extension to
raise with whoever owns that file, not something to route around here.

## 7. Live-call evidence (this session, different lectio instance)

For confirmation that this daemon's `memory_authored_activity` output really
matches the envelope in §1, a live call through an already-authenticated
MCP binding (no `gh_repos` configured on that instance, so an empty result)
returned:

```json
{"authored_commit_count":0,"authored_commits":[],"prs":[],"prs_with_activity":0,"since_nanos_used":1783722135258797000,"total_new_items":0}
```

confirming the top-level key set exactly matches §1's shape. That instance
had no populated `prs[]` entry to capture live (no gh coverage configured
there), so the populated example in §3/§4 is derived from source inspection
with illustrative content, not a live capture — the field *names and types*
are verified, the example PR/review *content* is invented for the fixture.
