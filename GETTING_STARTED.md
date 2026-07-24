# Getting Started

How to go from zero to a running canonical-hours PR board.

## Prerequisites

- Node 22+ — `task setup` uses [pnpm](https://pnpm.io) through Corepack
  when available, or an existing `pnpm` on `PATH`. The version is pinned
  in `package.json`.
- [Task](https://taskfile.dev) (`brew install go-task`) — every command in
  this doc runs through it, the same convention as
  [cloister](../cloister), [rosary](../rosary), and [mache](../mache).

No API keys are required for the first local proof. With an empty `.env`,
`task tick` still exercises the tick/fold/write path and records missing
or unreachable sources as board degradations instead of crashing.

Add credentials only for the integrations you want:

- **GitHub**: `GITHUB_TOKEN`. Read access is enough for board data; the
  two review-mutating tools need write access to review threads/reviews
  on repos you want them to mutate.
- **lectio**: `LECTIO_URL` + `LECTIO_TOKEN`. lectio contributes authored
  PR activity; GitHub remains the hard source for review verdicts.
- **Linear**: `LINEAR_API_KEY` plus a `[linear]` table in
  `canonical-hours.toml`.
- **Weather**: `WEATHER_API_KEY` plus a `[weather]` table in
  `canonical-hours.toml`, or `WEATHER_LOCATION` for the Worker host.
- **LLM summaries**: `ANTHROPIC_API_KEY`. Quiet/all-clear ticks spend no
  model calls; set `CANONICAL_HOURS_NO_MODEL=1` to force deterministic
  local mode even when the key exists.
- **Mutating MCP tools**: either `NOTME_URL` (recommended, DPoP
  proof-of-possession via [notme](https://github.com/agentic-research/notme))
  or `MCP_ACTION_TOKEN` (static shared-secret fallback). This gate is
  separate from `GITHUB_TOKEN`: the gate decides whether the caller may
  invoke the tool, and GitHub decides whether the tool's mutation request
  is allowed.
- **Private sources**: `CANONICAL_HOURS_PRIVATE_SOURCES_PATH` pointing at
  a built `dist/index.js`.

## Clone and configure

```sh
git clone https://github.com/agentic-research/canonical-hours.git
cd canonical-hours
task setup
```

`task setup` prepares pnpm, creates `.env` from `.env.example` if it
does not already exist, installs frozen dependencies, and wires local git
hooks when no existing hook manager is already present. It never
overwrites an existing `.env`. After this, you can run `task tick`
immediately even before filling in credentials.

The repo also commits pnpm's `allowBuilds` map in
`pnpm-workspace.yaml` for the native/dev toolchain packages that need
postinstall scripts: `esbuild`, `workerd`, and `sharp` (`sharp` comes
through Miniflare/Nitro/Eve image tooling, not canonical-hours
application code). You should not need to run `pnpm approve-builds` on a
fresh clone.

Fill in `.env` when you want real provider data:

```
LECTIO_URL=...
LECTIO_TOKEN=...
GITHUB_TOKEN=...
ANTHROPIC_API_KEY=...  # optional — enables Haiku summaries on material ticks
CANONICAL_HOURS_NO_MODEL=1  # optional — force deterministic no-model local mode
WEATHER_API_KEY=...    # optional — only if you want the weather snapshot
LINEAR_API_KEY=...     # optional — only if you enable the [linear] source
MCP_ACTION_TOKEN=...   # optional — static-secret gate; see the mutating-tools note above
NOTME_URL=...          # optional — recommended over MCP_ACTION_TOKEN, see above
NOTME_AUDIENCE=...     # optional — defaults to "canonical-hours"
NOTME_ISSUER=...       # optional — omit to accept any issuer
NOTME_REQUIRED_SCOPE=...   # optional
CANONICAL_HOURS_PRIVATE_SOURCES_PATH=...   # optional — see the private-sources note above
```

Secrets live in `.env`, never in the committed `canonical-hours.toml` —
that file only holds non-secret config (tick cadence, weather location,
GitHub GraphQL rate-limit backoff threshold, and the optional `[linear]`
assignee + staleness thresholds). A missing file or table falls back to
defaults; a malformed one fails the boot loudly, on purpose.

If you use notme for the mutating MCP tools, the notme deployment must
allow the audience canonical-hours verifies. By default canonical-hours
expects `NOTME_AUDIENCE=canonical-hours`; either configure notme's
`ALLOWED_AUDIENCES` accordingly or set both sides to the deployed
resource URL you want to pin.

Provider credentials are direct host env/bindings today. Moving GitHub,
Linear, and weather credentials behind rig/cloister outbound injection is
tracked separately so application code eventually names capabilities
instead of seeing plaintext provider tokens.

## Run it locally

For the simplest local smoke test, run one tick directly from the
Taskfile:

```sh
task tick
```

`task tick` does not start `eve dev`, does not open an interactive chat
session, reads `.env` before constructing its sources, and defaults
`CANONICAL_HOURS_NO_MODEL=1` for that process. It writes
`board/board.json` and `board/board.md` using the same tick/fold code as
the scheduled agent. This is the path to use when you want the tool to
run locally without any LLM provider configured.

To run the Eve dev server and expose the HTTP/MCP routes:

```sh
task dev    # eve dev — ensures deps are installed, then runs the agent
```

`eve dev` never fires the schedule's cron automatically — trigger a tick
by hand instead:

```sh
curl -X POST http://127.0.0.1:2000/eve/v1/dev/schedules/pr-board
curl http://127.0.0.1:2000/board       # board.json
curl http://127.0.0.1:2000/board/md    # human-readable
```

You should see either an all-clear board (nothing needs you) or a
material one. With `ANTHROPIC_API_KEY` set, material ticks ask Haiku for
summaries. Without it, or with `CANONICAL_HOURS_NO_MODEL=1`, material
ticks skip the agent turn and write a deterministic degraded fallback
board instead; you still get the concrete artifacts and observations,
just not LLM prose summaries. Either way, `board.json`/`board.md` land
in the `board/` directory, written atomically so a poll never sees a
half-written file.

The Eve dev prompt itself is still an LLM chat surface. In no-model
mode, use `task tick` or the schedule and board routes above; typing
messages at the prompt will still ask Eve for a model provider key.

There is also a workerd/miniflare-local host for the no-Eve path:

```sh
task dev:worker
```

This serves `GET /board`, `GET /board/md`, `POST /tick`, and an MCP
endpoint at `/mcp` with the same four tools as the Eve host:
`get_board`, `trigger_tick`, `resolve_addressed_review_threads`, and
`dismiss_stale_bot_reviews`. It does not invoke a model provider. It
persists board state in a Durable Object and registers provider sources
only when the corresponding env bindings are present, so a fresh local
run can tick without API keys. The review-mutating tools still require
`MCP_ACTION_TOKEN` or notme DPoP (`NOTME_URL`) before they touch GitHub.
Non-secret Worker config is env-based (`WEATHER_LOCATION`,
`GITHUB_MIN_REMAINING`, `LINEAR_TEAM`, `LINEAR_USER_EMAIL`, or
`CANONICAL_HOURS_CONFIG_JSON`); the Worker host intentionally does not
parse `canonical-hours.toml`.

If you want a Claude Code or Codex-powered prose pass without wiring an
API key into canonical-hours, use one of the optional wrapper tasks:

```sh
task brief:claude
task brief:codex
```

Both wrappers run `task tick` first, then hand `board/board.md` to the
respective CLI using that CLI's own auth/subscription. The canonical
tick remains deterministic; these wrappers are separate post-processing
briefs over the generated board, not hidden model calls inside the tick.

## Wire it into an MCP client (optional)

canonical-hours also speaks [MCP](https://modelcontextprotocol.io) at
`/mcp` (streamable-HTTP, JSON mode) — four tools: `get_board` (read-only),
`trigger_tick`, `resolve_addressed_review_threads`, and
`dismiss_stale_bot_reviews` (the last three are opt-in *actions*, and the
two review-mutating ones never fire automatically — see the README's MCP
surface reference for exactly what each does).

Register it with [cloister](../cloister) via `cloister add`, or hand any
other MCP client the `server.json` at the repo root (or the remote URL
directly: `http://<host>:<port>/mcp`) — no separate process, no polling
loop on the client side.

`server.json` points at the Eve/Nitro HTTP host by default and declares
external tenancy for cloister. The Worker host exposes the same tool
names for local workerd/miniflare and future service-binding deployment,
but it is not the default registry target yet.

## Everyday commands

```sh
task test           # vitest run
task typecheck       # tsc --noEmit
task test:worker     # Miniflare smoke for the no-Eve Worker host
task typecheck:worker # Worker host typecheck
task test:package    # build @agentic-research/vespers-core and import its ESM entrypoint
task codegen         # regenerate agent/lib/sources/generated/*.ts after editing graphql/sources/*.graphql
task check           # typecheck + package smoke + test — run before commit/push
task smells          # structural smell gate, ratcheted against docs/smell-baseline.json
task setup           # once per clone: env template + deps + local hooks
task install-hooks   # just the hook wiring piece, if you need to refresh it
task --list          # see everything, including build/watch/smells:baseline
```

`task setup` runs `task install-hooks` for you when it can. If an
existing non-symlink hook is already installed, setup leaves it alone and
continues; run `task install-hooks` directly after reconciling hooks if
you specifically need to refresh the smell-gate hook.

## Where to go next

- [README.md](README.md) — the project overview, MCP tool reference, and
  repo map.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — the full design: the
  hard/soft classification split, why the tick is stateless, the
  zero-LLM-call short-circuit, and a worked example tracing one PR through
  the whole pipeline.
- **Writing your own plugin (a new data source)?** See
  [docs/ARCHITECTURE.md § The second source kind: snapshots](docs/ARCHITECTURE.md#the-second-source-kind-snapshots) —
  `agent/lib/sources/weather.ts` is the worked example, ~50 lines, copy it
  first.
