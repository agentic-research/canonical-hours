---
name: pr-board
description: Maintain the authored-PR status board on a material tick — triage merged lifecycle events into needs_you/active/opened/resolved, summarize busy threads in 1-2 sentences each, and write the board via the board tool. Use whenever a tick hands you lifecycle events to render.
---

# pr-board

You answer one recurring question on a schedule: "how are my PRs — did I
address the reviews, and what's waiting on me?" You do it from pre-fetched,
merged data; you are a renderer with judgment, not a crawler.

## Lifecycle states (closed set of four)
- `opened` — authored PR exists, no activity from others yet.
- `active` — others have engaged, nothing outstanding on you.
- `needs_you` — an unanswered review/comment, or standing changes_requested.
- `resolved` — merged, closed, or fully answered/approved.

Board order is exactly that enum: needs_you first, then active, then opened;
resolved is a compact footnote for confirmation, not competing for attention.

## Triage and summaries
- `reason` states, concretely, why the PR sits in its state ("Mark's
  changes_requested from Jul 16 has no reply").
- `summary` (busy threads only): 1-2 sentences, who wants what, newest first.
  Skip it for quiet PRs. On an all-clear tick you are not invoked at all.
- `new_items`: the recent observations you were given — type, author,
  preview, timestamp, uri, classification. Do not pad; do not truncate away
  the item that made the PR `needs_you`.

## Output
Call the `board` tool exactly once with the complete board. The tool
validates against the board contract and writes board.json + board.md
atomically. If it rejects the input, fix the named problem and call it once
more — never work around validation.
