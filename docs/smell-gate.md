# Structural smell gate

Status: **baseline committed, CI wired** (canonical-hours-4ba370 fixed
the pre-commit hook; the CI half landed via `.github/workflows/ci.yml`
and `.github/workflows/smells.yml`, using mache's composite Action).

## What exists now

- `docs/smell-baseline.json` — the ratchet baseline: every structural
  smell present at bootstrap time, grandfathered. The gate model is
  "no *new* debt": findings already in the baseline never fail a run;
  findings not in it do.
- `task smells` / `task smells:baseline` run `--tags=gate` — the same
  rule-tag selection mache's own Taskfile and its composite GitHub
  Action use (verified directly against `~/remotes/art/mache`'s
  Taskfile.yml and `.github/actions/find-smells/action.yml`). This
  excludes the two rules with `Tags: null` upstream —
  `cyclomatic_complexity` and `magic_int_in_comparison` — which mache
  treats as always-firing "firehose" advisories rather than ratchet
  material, not gate signals. Keeping our local tag selection aligned
  with the Action's hardcoded `--tags=gate` is what makes it safe to
  gate CI with the shared Action directly instead of reimplementing
  the invocation in YAML.

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

## CI wiring

`.github/workflows/smells.yml` uses `agentic-research/mache`'s
composite GitHub Action (the same one mache dogfoods on itself), pinned
to a release tag rather than `@main`. It gates on
`docs/smell-baseline.json`. SARIF upload to the code-scanning tab is
disabled (`upload-sarif: false`) — this repo is private and that
upload requires GitHub Advanced Security, which isn't enabled here; it
can be turned back on later if that changes. `.github/workflows/ci.yml`
runs `task check` (typecheck + test) — independent of the smell gate,
its own workflow.

If the pinned mache release is bumped, re-verify the action's exact
input names and default rule-tag selection against
`agentic-research/mache`'s `.github/actions/find-smells/action.yml`
and `examples/smell-rules/README.md` before assuming they're unchanged
— the action's `--tags=gate` selection must keep matching this repo's
own `task smells` invocation (see above) or CI and local dev diverge.
