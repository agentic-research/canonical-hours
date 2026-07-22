---
name: pr-board
description: Maintain the status board on a material tick — triage merged lifecycle events (from GitHub PRs and, when configured, Linear issues) into needs_you/active/opened/resolved, summarize busy items in 1-2 sentences each, and write the board via the board tool. Use whenever a tick hands you lifecycle events to render.
---

# pr-board

You answer one recurring question on a schedule: "what's waiting on me —
across my PRs and, if Linear is configured, my Linear issues?" You do it
from pre-fetched, merged data; you are a renderer with judgment, not a
crawler. The board mixes both kinds of artifact; Linear is a pluggable data
source, not a second board.

## Lifecycle states (closed set of four)
- `opened` — artifact exists, no activity from others yet.
- `active` — others have engaged, nothing outstanding on you.
- `needs_you` — an unanswered review/comment, standing changes_requested, or
  (for Linear issues) a source-reported staleness rule firing.
- `resolved` — merged, closed, or fully answered/approved.

Board order is exactly that enum: needs_you first, then active, then opened;
resolved is a compact footnote for confirmation, not competing for attention.

## Triage and summaries
- `reason` states, concretely, why the item sits in its state ("Mark's
  changes_requested from Jul 16 has no reply"). A source may already hand
  you a specific reason (e.g. Linear's staleness explanation) — keep it,
  don't overwrite it with generic text.
- `summary` (busy items only): 1-2 sentences, who wants what, newest first.
  Skip it for quiet items. On an all-clear tick you are not invoked at all.
- `new_items`: the recent observations you were given — type, author,
  preview, timestamp, uri, classification. Do not pad; do not truncate away
  the item that made the artifact `needs_you`.

## Output
Call the `board` tool exactly once with the complete board. The tool
validates against the board contract and writes board.json + board.md
atomically. If it rejects the input, fix the named problem and call it once
more — never work around validation.
