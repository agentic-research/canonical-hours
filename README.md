# canonical-hours

canonical-hours is a standing [eve.dev](https://eve.dev) agent for
scheduled operational checks and MCP-triggered durable status boards. It
polls sources such as GitHub, lectio, Linear, and weather, folds their
observations into one material board, and serves the result over HTTP/MCP
without pushing or mutating anything on its own.

The first board answers a concrete question: **"how are my PRs, and does
anything need me?"** That PR board is the proof case, not the boundary.
The same tick/fold machinery also handles Linear issues and current-value
snapshots, and the portable core lives in
[`@agentic-research/vespers-core`](packages/vespers/README.md) so those
semantics can move into workerd/cloister/Durable Object/Wasm-style hosts
without bringing along Eve or Node filesystem assumptions.

In other words: canonical-hours is the standing host and integration
surface; Vespers Core is the reusable kernel under it.

**New here?** → [GETTING_STARTED.md](GETTING_STARTED.md) for the full
setup, local run, and MCP-wiring walkthrough. The sections below are
reference material — expand what you need.

<details>
<summary><strong>Status</strong></summary>

Every tick path (all-clear, degraded-fallback, material/LLM-triaged)
and the MCP surface run end to end against `eve dev`. CI
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs typecheck
+ test on every push; the structural smell gate runs as its own
workflow ([`smells.yml`](.github/workflows/smells.yml)). Runs locally
today; a deployment target (fly.io or Vercel) is next. Full verification
matrix: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#whats-verified-and-whats-not).

</details>

<details>
<summary><strong>How it works</strong></summary>

Each tick fetches from its activity sources — GitHub (review
*verdicts*, merges, and closes, over its GraphQL API), lectio (activity
only — no way to expose a review's verdict, so it's soft-only by
design), and, when configured, Linear (your own stale or stuck issues,
plus a completed/canceled issue's own hard close) — merges them by
canonical artifact (a PR or a Linear issue),
folds the merged observations into one of four lifecycle states
(`opened` → `active` → `needs_you` → `resolved`), and, only if
something actually needs attention, hands the material off to a Haiku
model to triage and summarize. A quiet tick costs zero LLM calls. The
board is written atomically so a poll never sees a half-written file.
Every source is optional and self-degrading: a missing or misconfigured
one — lectio included, no longer a hard boot requirement — becomes a
`degradations` entry on that tick, never a crash.

Three independent things can put a PR in `needs_you`: a standing
`changes_requested` review, an unanswered comment, or a **failing
branch-protection-required CI check** (an optional/non-required check
failing, or any check merely still running, does not count). GitHub is
also the source for this: the same GraphQL fetch reads each PR's
check-run rollup, and a real failure surfaces as a `check_failed` board
entry alongside whichever review activity is also present. The board
also carries a derived `merge_ready` boolean per PR — `true` when the
PR is approved (or needs no review), has no failing required checks,
and has no unresolved review threads — computed deterministically,
never folded into a lifecycle state.

Linear is a fourth activity source (optional — enabled by a `[linear]`
table in `canonical-hours.toml`, absent means simply not registered),
and it works differently from GitHub/lectio's windowed fetch: it runs an
oncall-mode staleness sweep over every status for one configured
assignee, not a time window, and flags a stale or stuck issue the same
way a failing required check does — by setting `state_hint: "needs_you"`,
the exact mechanism `check_failed` already uses, with no new `foldState`
branch. The staleness reason (e.g. "P1 stuck in Triage for 9d") rides a
new, generic `extra.reason` override so the board prints the real reason
instead of the generic PR-shaped text — the same passthrough `merge_ready`
already uses, not source-specific plumbing. A `completed` or `canceled`
Linear issue resolves through the *exact* hard-terminal fold rule a
merged or closed PR already hits: zero new fold logic, because the
`Artifact` is now a `pr | issue` discriminated union that `mergeEvents`
and `foldState` handle by URI alone.

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

</details>

<details>
<summary><strong>MCP surface</strong></summary>

canonical-hours is meant to be the general home for scheduled,
repeatable agent tasks — not just a PR board — so that whole class of
capability needs to be queryable and triggerable by other agent
infrastructure, not just by a human hitting `curl`. Alongside the REST
routes (`GET /board`, `GET /board/md` — see
[GETTING_STARTED.md](GETTING_STARTED.md)), it also speaks
[MCP](https://modelcontextprotocol.io) (streamable-HTTP, JSON mode) at
`/mcp`, so it can be registered as a tool server with
[cloister](../cloister) (a v8-isolate hypervisor that bundles MCP
servers behind one endpoint) or any other MCP client — no separate
process, no polling loop on the client side.

Four tools — the first two mirror what's already exposed over REST; the
last two are opt-in mutating actions that **never fire from the tick** and
are **default-deny** (canonical-hours-49ba33 — see below):

| Tool | Kind | Behavior |
| --- | --- | --- |
| `get_board` | read-only | Same data as `GET /board` / `GET /board/md` — the current board as structured JSON plus rendered markdown. Never triggers a tick. |
| `trigger_tick` | action | Runs a tick now (the same `prBoardTick()` the cron schedule calls) and returns the real six-way `TickResult`, including `skipped_overlap` — a legitimate result, not an error, when a tick is already in flight. |
| `resolve_addressed_review_threads` | action, gated | Resolves each unresolved review thread on a PR whose file was changed in a commit landed after the thread's originating review (mechanical eligibility, ported from `watch-pr`). Mutates GitHub; call with a PR as `owner/repo#123` or a github.com PR URL. |
| `dismiss_stale_bot_reviews` | action, gated | Dismisses each `CHANGES_REQUESTED` review from a bot account where a fix commit landed after it (bot = GraphQL `__typename` `Bot` or a `[bot]`-suffixed login, never a bare `-bot`). Mutates GitHub; same PR-reference input. |

The two mutating tools go through `agent/lib/action-gate.ts`'s
`ActionGate` before touching GitHub — a pluggable authorization hook, not
eve's `defineTool` `approval()` primitive (that gates a *model's own* tool
call inside an eve session; these tools are called by external MCP
clients over a stateless HTTP channel, outside any session, so it doesn't
apply here). `defaultActionGate()` picks one of two implementations, both
default-deny:

- **`sharedSecretGate()`** (default when `NOTME_URL` is unset): a static
  shared secret — set `MCP_ACTION_TOKEN`, and callers must send a
  matching `Authorization: Bearer <token>` header. Simple, but a leaked
  token grants indefinite access.
- **`notmeDpopGate()`** (used when `NOTME_URL` is set) — the recommended
  option, and a real security upgrade, not a token swap: it verifies a
  [notme](https://github.com/agentic-research/notme)-issued DPoP-bound
  access token (RFC 9449), sender-constrained proof-of-possession rather
  than a bearer secret. Stealing the `Authorization`/`DPoP` header pair
  gets an attacker nothing — the token is cryptographically bound
  (`cnf.jkt`) to a private key that's generated client-side and never
  transmitted, so a captured header pair is useless without it. This is
  the same identity model backing the rest of this org's infrastructure
  (cloister, rig); `MCP_ACTION_TOKEN`/`sharedSecretGate()` is the
  zero-dependency fallback for anyone not running notme, not the
  preferred path. Set `NOTME_URL` (and optionally `NOTME_AUDIENCE`,
  `NOTME_REQUIRED_SCOPE`) to switch to it — see `agent/lib/action-gate.ts`.

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

</details>

<details>
<summary><strong>Repo map</strong></summary>

- `packages/vespers` (`@agentic-research/vespers-core`, a pnpm workspace package) — the
  portable tick/fold engine: the `Source`/`Artifact`/`Observation`/`LifecycleEvent`
  protocol, `mergeEvents`/`foldState`, `runTick`, the `Board` schema and
  markdown renderer, the `BoardStore` interface, and the pure parts of
  config parsing. Zero dependency on eve or `node:fs` — proven
  workerd-portable by a live `@cloudflare/vitest-pool-workers` test
  (`packages/vespers/test-workerd/portability.test.ts`), not just an
  absence-of-imports argument. `Artifact` is a `pr | issue` discriminated
  union, proven generic by its second consumer (Linear), not PR-shaped
  anymore. The package builds to `dist/` for public npm consumers, so
  downstream installs do not need GitHub Packages tokens.
  See [docs/ARCHITECTURE.md § `@agentic-research/vespers-core`](docs/ARCHITECTURE.md#vespers-core-the-portable-tickfold-engine).
- `agent/lib/sources/` — the four adapters (`lectio.ts`, GraphQL-based
  `github.ts`, `linear.ts`, `weather.ts`, the last implementing
  `@agentic-research/vespers-core`'s `SnapshotSource`) — application integrations against
  the portable protocol above, not generic machinery themselves.
  `linear.ts` (`LinearSource`) runs an oncall-mode staleness sweep over
  one assignee's Linear issues, reporting staleness via `state_hint` +
  `extra.reason`.
- `agent/lib/node-board-store.ts`, `agent/tools/board.ts` — the
  Node/eve-side board persistence: `NodeBoardStore` (the actual
  `node:fs` write-temp-then-rename atomicity) implementing `@agentic-research/vespers-core`'s
  `BoardStore`, and the eve tool that writes through it.
- `agent/lib/tick-entry.ts`, `agent/schedules/pr-board.ts`,
  `agent/channels/{tick,board}.ts` — the scheduled tick's canonical-hours-side
  wiring (constructing sources, `NodeBoardStore`, and calling
  `@agentic-research/vespers-core`'s `runTick`).
- `agent/channels/mcp.ts`, `server.json` — the MCP surface (`get_board`,
  `trigger_tick`, `resolve_addressed_review_threads`,
  `dismiss_stale_bot_reviews`) and its registry document, for cloister
  and other MCP clients. The two action tools' mechanical eligibility
  lives in `agent/lib/{thread-resolution,bot-review-dismissal}.ts`,
  sharing `agent/lib/{pr-ref,github-graphql}.ts`. `agent/lib/action-gate.ts`
  is the pluggable default-deny gate those two tools run through.
- `canonical-hours.toml`, `agent/lib/config.ts` — committed non-secret
  config (tick cron, weather location, GitHub GraphQL rate-limit
  backoff threshold, optional `[linear]` assignee + staleness thresholds).
  `config.ts` is a thin `readFileSync`/ENOENT-defaults wrapper around
  `@agentic-research/vespers-core`'s pure `ConfigSchema`/`parseConfig`; secrets
  (`LINEAR_API_KEY` included) stay in `.env`.
- `agent/lib/private-sources.ts` — loads an optional fifth pluggable
  source registry from a private, external package via
  `CANONICAL_HOURS_PRIVATE_SOURCES_PATH`. Absent means the feature is simply
  off, same convention as `[weather]`/`[linear]`.
- `agent/instructions.md`, `agent/skills/pr-board/SKILL.md` — the
  agent's behavioral prose (posture, tick procedure, triage rules).
- `docs/eve-api-notes.md`, `docs/lectio-api-notes.md` — implementation
  research notes on the eve and lectio APIs, cited from the code.

</details>

<details>
<summary><strong>Commands</strong></summary>

Local dev and CI (once this repo has a workflow) both run through
[Taskfile.yml](Taskfile.yml) — the same convention as
[cloister](../cloister), [rosary](../rosary), and
[mache](../mache). Never invoke `pnpm`/`tsc`/`vitest` directly in a
workflow; call the matching `task` target instead. Full walkthrough in
[GETTING_STARTED.md](GETTING_STARTED.md).

```sh
task dev          # eve dev — run the agent locally
task build        # eve build
task test         # vitest run
task typecheck    # tsc --noEmit
task codegen      # regenerate agent/lib/sources/generated/*.ts after editing graphql/sources/*.graphql
task check        # typecheck + test — the fast inner-loop gate
task smells       # structural smell gate, ratcheted against docs/smell-baseline.json
task install-hooks  # once per clone: wires task smells into .git/hooks/pre-commit
task --list       # see everything, including deps/watch/smells:baseline
```

</details>
