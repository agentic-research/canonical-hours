# canonical-hours

canonical-hours answers one recurring question — "how are my PRs, and
does anything need me?" — on a schedule, without you asking. It's an
[eve.dev](https://eve.dev) agent that ticks every 4 hours, pulls your
authored-PR activity from GitHub and from
[lectio](../lectio) (an observational memory server), folds it into a
short status board, and serves that board over HTTP. You poll it; it
never pushes.

It's a port of an interactive Claude Code skill
([`pr-board`](agent/skills/pr-board/SKILL.md)) into a standing agent —
same question, but answered continuously instead of only when you ask.

```sh
cp .env.example .env    # fill in LECTIO_URL/TOKEN, GITHUB_TOKEN, ANTHROPIC_API_KEY
pnpm install
pnpm dev                # eve dev — runs the agent locally
```

With `eve dev` running, fire a tick manually (the schedule's 4-hour cron
never fires in dev) and read the board back:

```sh
curl -X POST http://127.0.0.1:2000/eve/v1/dev/schedules/pr-board
curl http://127.0.0.1:2000/board       # board.json
curl http://127.0.0.1:2000/board/md    # human-readable
```

## Status

Working and locally verified — not yet deployed anywhere. Every tick
path (all-clear, degraded, and material/LLM-triaged) has been exercised
end to end against `eve dev`, but there is no CI workflow and no fly.io
or Vercel deployment yet. See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#whats-verified-and-whats-not)
for exactly what's proven and what isn't.

## How it works

Each tick fetches from two sources — GitHub (the sole source of review
*verdicts*) and lectio (activity only, no verdicts) — merges them by
canonical PR, folds the merged observations into one of four lifecycle
states (`opened` → `active` → `needs_you` → `resolved`), and, only if
something actually needs attention, hands the material off to a Haiku
model to triage and summarize. A quiet tick costs zero LLM calls. The
board is written atomically so a poll never sees a half-written file.

Full design — the hard/soft classification split, why the tick is
stateless instead of cursor-based, the zero-LLM-call short-circuit, and
a worked example tracing one PR through the whole pipeline — is in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Repo map

- `agent/sources/` — the `Source` protocol and the two adapters
  (`lectio.ts`, `github.ts`), plus `merge.ts` (dedupe + fold logic).
- `agent/lib/board.ts`, `agent/tools/board.ts` — the board's zod schema,
  markdown renderer, and atomic writer.
- `agent/lib/tick.ts`, `agent/schedules/pr-board.ts`,
  `agent/channels/{tick,board}.ts` — the scheduled tick and its wiring.
- `agent/instructions.md`, `agent/skills/pr-board/SKILL.md` — the
  agent's behavioral prose (posture, tick procedure, triage rules).
- `docs/eve-api-notes.md`, `docs/lectio-api-notes.md` — implementation
  research notes on the eve and lectio APIs, cited from the code.

## Commands

```sh
pnpm dev         # eve dev — run the agent locally
pnpm build       # eve build
pnpm test        # vitest run
pnpm typecheck   # tsc --noEmit
```
