# Getting Started

How to go from zero to a running canonical-hours PR board.

## Prerequisites

- Node + [pnpm](https://pnpm.io) — the Taskfile installs deps for you, but
  both need to already be on `PATH`.
- [Task](https://taskfile.dev) (`brew install go-task`) — every command in
  this doc runs through it, the same convention as
  [cloister](../cloister), [rosary](../rosary), and [mache](../mache).
- A GitHub personal access token with `repo` scope (read access to your PRs
  is enough; the two action tools below need write access to review
  threads/reviews on repos you want them to mutate).
- If you want the two mutating action tools (`resolve_addressed_review_threads`,
  `dismiss_stale_bot_reviews`) reachable at all, an authorization gate —
  they're default-deny (canonical-hours-49ba33): with neither option below
  configured, every call is refused before it ever touches GitHub. This is
  independent of `GITHUB_TOKEN`'s scope above — one controls whether a
  caller may invoke the tool at all, the other controls whether the tool's
  own GitHub call succeeds once invoked. You need both for the tools to
  actually work end to end. Two gates, pick one:
  - **`NOTME_URL`** (recommended) — verifies a
    [notme](https://github.com/agentic-research/notme)-issued DPoP-bound
    access token, real proof-of-possession: a captured header pair alone
    is useless without the caller's private key. Optional
    `NOTME_AUDIENCE` (defaults `"canonical-hours"`), `NOTME_ISSUER`
    (omit to accept any issuer), and `NOTME_REQUIRED_SCOPE`.
  - **`MCP_ACTION_TOKEN`** — a static shared secret; callers send a
    matching `Authorization: Bearer` header. Simpler, no notme
    dependency, but a leaked token is indefinite access.
- Optionally, access to a running [lectio](../lectio) instance
  (`LECTIO_URL` + `LECTIO_TOKEN`) — canonical-hours reads authored-PR
  *activity* from lectio and review *verdicts* from GitHub, and merges
  the two. lectio is optional like every other source: if it's absent or
  misconfigured it degrades gracefully to a `degradations` entry, it is
  no longer a hard boot requirement.
- Optionally, a Linear API key (`LINEAR_API_KEY`) plus a `[linear]` table
  in `canonical-hours.toml` — pulls your own stale or stuck Linear issues
  onto the same board. Absent means the source is simply not registered.
- Optionally, a private
  [jamestexas/canonical-hours-private](https://github.com/jamestexas/canonical-hours-private)
  checkout (`CANONICAL_HOURS_PRIVATE_SOURCES_PATH` pointing at its built
  `dist/index.js`) for sensitive personal sources that don't belong in
  this public repo. Absent means the feature is simply off — see that
  repo's README.
- An `ANTHROPIC_API_KEY` — only spent on ticks where something material
  actually changed (see [Architecture](docs/ARCHITECTURE.md) for the
  zero-LLM-call short circuit); a quiet tick costs nothing.

## Clone and configure

```sh
git clone https://github.com/agentic-research/canonical-hours.git
cd canonical-hours
cp .env.example .env
```

Fill in `.env`:

```
LECTIO_URL=...
LECTIO_TOKEN=...
GITHUB_TOKEN=...
ANTHROPIC_API_KEY=...
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

## Run it locally

```sh
task dev    # eve dev — installs deps first, then runs the agent
```

`eve dev` never fires the schedule's cron automatically — trigger a tick
by hand instead:

```sh
curl -X POST http://127.0.0.1:2000/eve/v1/dev/schedules/pr-board
curl http://127.0.0.1:2000/board       # board.json
curl http://127.0.0.1:2000/board/md    # human-readable
```

You should see either an all-clear board (nothing needs you) or a
material one (something does, and Haiku's already summarized it) — either
way, `board.json`/`board.md` land in the `board/` directory, written
atomically so a poll never sees a half-written file.

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

## Everyday commands

```sh
task test           # vitest run
task typecheck       # tsc --noEmit
task codegen         # regenerate agent/lib/sources/generated/*.ts after editing a .graphql file
task check           # typecheck + test — the fast inner-loop gate
task smells          # structural smell gate, ratcheted against docs/smell-baseline.json
task install-hooks   # once per clone: wires task smells into .git/hooks/pre-commit
task --list          # see everything, including build/watch/smells:baseline
```

Run `task install-hooks` once after cloning — it's what makes the smell
gate actually block a bad commit locally instead of only running in CI.

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
