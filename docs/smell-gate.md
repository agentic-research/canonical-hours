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

    mache build . smells.db
    mache find-smells --db smells.db --rule '*' --limit 100000 \
      --baseline-root "$PWD" --write-baseline docs/smell-baseline.json

`smells.db` is gitignored — commit only the baseline. Re-run
`--write-baseline` only when deliberately re-grandfathering (e.g.
after a large accepted refactor); day-to-day runs should *check*
against the committed baseline instead.

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
