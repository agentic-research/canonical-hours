# canonical-hours

canonical-hours is a standing [eve.dev](https://eve.dev) agent for
repeatable checks — run on a schedule, or triggered on demand via MCP.
PR board is the flagship one: **"how are my PRs, and does anything
need me?"** It pulls your authored-PR activity from GitHub and
[lectio](../lectio) and folds it into a short status board, served
over HTTP. Ticks fire on a configurable cron by default, or right now
via the MCP `trigger_tick` tool — either way, canonical-hours never
pushes; you poll or call.

The pipeline is pluggable, not PR-specific: a second kind of check —
current-value snapshots like the weather — rides the same tick, no LLM
involved.

It's a port of an interactive Claude Code skill
([`pr-board`](agent/skills/pr-board/SKILL.md)) into a standing agent —
same question, but answered continuously instead of only when you ask.

```sh
cp .env.example .env    # fill in LECTIO_URL/TOKEN, GITHUB_TOKEN, ANTHROPIC_API_KEY (+ optional WEATHER_API_KEY)
task dev                # eve dev — runs the agent locally (installs deps first)
```

With `eve dev` running, fire a tick manually (the schedule's cron never
fires in dev) and read the board back:

```sh
curl -X POST http://127.0.0.1:2000/eve/v1/dev/schedules/pr-board
curl http://127.0.0.1:2000/board       # board.json
curl http://127.0.0.1:2000/board/md    # human-readable
```

## Status

Every tick path (all-clear, degraded-fallback, material/LLM-triaged)
and the MCP surface run end to end against `eve dev`. Runs locally
today; a deployment target (fly.io or Vercel) is next. Full verification
matrix: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#whats-verified-and-whats-not).

## How it works

Each tick fetches from two sources — GitHub (the sole source of review
*verdicts*, over its GraphQL API) and lectio (activity only, no
verdicts) — merges them by canonical PR, folds the merged observations
into one of four lifecycle states (`opened` → `active` → `needs_you` →
`resolved`), and, only if something actually needs attention, hands
the material off to a Haiku model to triage and summarize. A quiet
tick costs zero LLM calls. The board is written atomically so a poll
never sees a half-written file.

Three independent things can put a PR in `needs_you`: a standing
`changes_requested` review, an unanswered comment, or — the newest
signal — a **failing branch-protection-required CI check** (an
optional/non-required check failing, or any check merely still
running, does not count). GitHub is also the source for this: the same
GraphQL fetch reads each PR's check-run rollup, and a real failure
surfaces as a `check_failed` board entry alongside whichever review
activity is also present.

Two generalizations sit on top of that pipeline. First, the tick
outcome is three-way: `all_clear` (nothing material — templated board,
zero LLM calls), `material_unchanged` (the material set is identical to
the last board's `material_hash` — the board is refreshed
deterministically, prior LLM summaries carried over, still zero LLM
calls), and `material` (the set actually changed — Haiku triages). The
three-way tick is what makes the 5-minute default cadence affordable.
Second, the board carries **snapshot sources** — current-value readings
(v1: weather, via `WEATHER_API_KEY` + a `[weather]` location in
`canonical-hours.toml`) with no lifecycle and no LLM involvement,
fetched every tick and attached to whichever board gets written. Cadence,
the weather location, and GitHub's GraphQL rate-limit backoff threshold
(`[github].min_remaining`, default 200) all live in the committed,
non-secret `canonical-hours.toml`; a missing file or table means
defaults, a malformed one fails the boot loudly.

Full design — the hard/soft classification split, why the tick is
stateless instead of cursor-based, the zero-LLM-call short-circuit, and
a worked example tracing one PR through the whole pipeline — is in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## MCP surface

canonical-hours is meant to be the general home for scheduled,
repeatable agent tasks — not just a PR board — so that whole class of
capability needs to be queryable and triggerable by other agent
infrastructure, not just by a human hitting `curl`. Alongside the REST
routes above, it also speaks
[MCP](https://modelcontextprotocol.io) (streamable-HTTP, JSON mode) at
`/mcp`, so it can be registered as a tool server with
[cloister](../cloister) (a v8-isolate hypervisor that bundles MCP
servers behind one endpoint) or any other MCP client — no separate
process, no polling loop on the client side.

Two tools, mirroring what's already exposed over REST:

| Tool | Kind | Behavior |
| --- | --- | --- |
| `get_board` | read-only | Same data as `GET /board` / `GET /board/md` — the current board as structured JSON plus rendered markdown. Never triggers a tick. |
| `trigger_tick` | action | Runs a tick now (the same `prBoardTick()` the cron schedule calls) and returns the real six-way `TickResult`, including `skipped_overlap` — a legitimate result, not an error, when a tick is already in flight. |

`server.json` at the repo root is the registry document a cloister
`cloister add` (or equivalent MCP client registration) consumes: it
declares the `streamable-http` remote at `/mcp` with a configurable
port, and marks the server `external`/untrusted tenancy — canonical-hours
runs on Node via eve, not inside a v8 isolate, so it can't be
co-located with the hypervisor and shouldn't be trusted as if it were.
To point a client at a running instance, register the deployed
`server.json` (or hand the client the remote URL directly:
`http://<host>:<port>/mcp`). See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#the-mcp-surface) for the
transport and tenancy details.

## Repo map

- `packages/core` (`@canonical-hours/core`, a pnpm workspace package) —
  the genuinely generic, proven-by-a-second-consumer pieces:
  `SnapshotSource`/`SnapshotValue` and `FetchWindow`. `agent/sources/source.ts`'s
  `Source`/`Artifact` protocol stays local — it's still PR-shaped v1,
  not yet proven generic beyond PR board.
- `agent/sources/` — the `Source` protocol and the two adapters
  (`lectio.ts`, GraphQL-based `github.ts`), plus `merge.ts` (dedupe +
  fold logic) and the weather adapter (`weather.ts`, implements
  `packages/core`'s `SnapshotSource`).
- `agent/lib/board.ts`, `agent/tools/board.ts` — the board's zod schema,
  markdown renderer, and atomic writer.
- `agent/lib/tick.ts`, `agent/schedules/pr-board.ts`,
  `agent/channels/{tick,board}.ts` — the scheduled tick and its wiring.
- `agent/channels/mcp.ts`, `server.json` — the MCP surface (`get_board`,
  `trigger_tick`) and its registry document, for cloister and other MCP
  clients.
- `canonical-hours.toml`, `agent/lib/config.ts` — committed non-secret
  config (tick cron, weather location, GitHub GraphQL rate-limit
  backoff threshold) and its loader; secrets stay in `.env`.
- `agent/instructions.md`, `agent/skills/pr-board/SKILL.md` — the
  agent's behavioral prose (posture, tick procedure, triage rules).
- `docs/eve-api-notes.md`, `docs/lectio-api-notes.md` — implementation
  research notes on the eve and lectio APIs, cited from the code.

## Commands

Local dev and CI (once this repo has a workflow) both run through
[Taskfile.yml](Taskfile.yml) — the same convention as
[cloister](../cloister), [rosary](../rosary), and
[mache](../mache). Never invoke `pnpm`/`tsc`/`vitest` directly in a
workflow; call the matching `task` target instead.

```sh
task dev          # eve dev — run the agent locally
task build        # eve build
task test         # vitest run
task typecheck    # tsc --noEmit
task check        # typecheck + test — the fast inner-loop gate
task smells       # structural smell gate, ratcheted against docs/smell-baseline.json
task install-hooks  # once per clone: wires task smells into .git/hooks/pre-commit
task --list       # see everything, including deps/watch/smells:baseline
```
