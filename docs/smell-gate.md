# Structural smell gate (bootstrap)

Status: **baseline committed, CI wiring deferred.** This repo has no CI
workflow at all yet (see ARCHITECTURE.md, "What's verified, and what's
not"), so this document bootstraps the ratchet and records how to wire
the gate when CI lands — it deliberately does not create a workflow.

## What exists now

- `docs/smell-baseline.json` — the ratchet baseline: every structural
  smell present at bootstrap time, grandfathered. The gate model is
  "no *new* debt": findings already in the baseline never fail a run;
  findings not in it do.

## Regenerating locally

From the repo root (requires the `mache` CLI from
`agentic-research/mache`):

    task smells:baseline

Or run the two `mache` commands directly:

    mache build . smells.db
    mache find-smells --db smells.db --rule '*' --limit 100000 \
      --baseline-root "$PWD" --write-baseline docs/smell-baseline.json

`smells.db` is gitignored — commit only the baseline. Re-run
`--write-baseline` only when deliberately re-grandfathering (e.g.
after a large accepted refactor); day-to-day runs should *check*
against the committed baseline instead.

**If any other process (a concurrent agent, a background task) might
have unstaged or untracked changes on disk right now, use
`task smells:baseline:safe` instead.** `task smells:baseline` scans
the real working tree exactly as it is — including anything unrelated
that happens to be sitting there unstaged. `smells:baseline:safe`
regenerates against a scratch copy of the STAGED tree only (via `git
checkout-index`), immune to that contamination. This was a real,
repeatedly-hit failure mode during the linear-source build
(canonical-hours-4ba370) before this target existed.

## Baselining a new file — commit it together with the baseline update

When you're about to grandfather a **new, not-yet-committed** file's
findings (as opposed to re-baselining an existing tracked file), the
baseline update and the new file **must land in the same commit** —
never split across a "baseline first, file second" pair of commits,
even though that two-commit shape is otherwise this repo's normal
convention for baseline bumps.

This isn't a workaround for a bug — it's genuinely how git's
pathspec-restricted commits work. `git commit -- <path>` doesn't
commit "the current index, restricted to that path" — it commits
**HEAD's tree with only the named path(s) substituted in**. A
`git commit -- docs/smell-baseline.json` commit's resulting tree
therefore never contains a new file that's staged in a *different*,
unpathspec'd commit — regardless of what else is staged in the index
at the time. If the baseline you're committing already has entries
for that not-yet-committed file, the very next commit that adds it
will find a baseline that's stale for the world it's actually
introducing (or, in the other order, a baseline-only commit whose own
tree genuinely doesn't have the file yet will correctly show as clean,
but then the file's own commit has nothing baselining its findings).

The fix is procedural, not technical: `git add` the baseline update
*and* the new file together, and commit them as one change. The
pre-commit hook's own isolation (`git checkout-index` against
`GIT_INDEX_FILE`, matching whatever git will actually commit) handles
pathspec-restricted commits correctly *as git defines them* — it
can't paper over a two-commit split that's structurally asking for two
different, mutually-inconsistent trees.

## Future CI wiring (when a workflow exists)

`agentic-research/mache` ships a composite GitHub Action that mache
itself dogfoods. When this repo grows a CI workflow, add a job shaped
like the sketch below. **The sketch is illustrative** — confirm the
action's exact input names against
`agentic-research/mache`'s `examples/smell-rules/README.md` and the
action definition at `.github/actions/find-smells` before wiring it.

    # sketch — do not commit as-is; verify inputs against the action
    jobs:
      smells:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: agentic-research/mache/.github/actions/find-smells@main
            with:
              baseline: docs/smell-baseline.json
