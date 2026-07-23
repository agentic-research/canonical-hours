# `@agentic-research/vespers-core`

Portable tick/fold engine for agentic board state.

Vespers is the runtime-neutral core extracted from
[`canonical-hours`](https://github.com/agentic-research/canonical-hours). It
generalizes the durable parts of an Eve agent — source protocols, lifecycle
events, deterministic merge/fold logic, board schema, markdown rendering, config
parsing, and the `runTick()` loop — so the same board engine can run outside a
Node-hosted Eve process.

## Why This Exists

canonical-hours is the standing Eve agent that schedules ticks, hosts the MCP
surface, and wires concrete integrations. Vespers is the portable kernel under
that agent: no Eve dependency, no Node filesystem dependency, and no assumption
about the host runtime.

That split lets downstream hosts reuse the same board semantics in environments
like Cloudflare Workers `workerd`, cloister isolates, Durable Objects, or a
future Wasm-backed runtime. The package is tested both under Node/Vitest and
under a simulated Cloudflare Workers `workerd` runtime.

## Install

```sh
pnpm add @agentic-research/vespers-core
```

## Use

```ts
import {
  BoardSchema,
  runTick,
  renderBoardMd,
  type BoardStore,
  type Source,
} from "@agentic-research/vespers-core";
```

`Source` implementations fetch observations from systems like GitHub, Linear,
Lectio, weather, or private registries. `BoardStore` is the one storage seam:
bring your own filesystem, KV, Durable Object, database, or in-memory adapter.

```ts
const result = await runTick({
  sources,
  boardStore,
  now: new Date(),
});

console.log(renderBoardMd(BoardSchema.parse(result.board)));
```

## Exports

| export | purpose |
| --- | --- |
| `runTick()` | Fetch sources, merge lifecycle events, fold board state, and persist it through a `BoardStore`. |
| `mergeEvents()` / `foldState()` | Deterministic event ordering and pure state folding. |
| `BoardSchema` / `ConfigSchema` | Zod schemas for board and config validation. |
| `renderBoardMd()` | Markdown renderer for board snapshots. |
| `Source` / `SnapshotSource` | Protocols for event and snapshot producers. |
| `BoardStore` | Minimal persistence interface for host runtimes. |

## Design Notes

Vespers models PRs, issues, and snapshots as observations over artifacts rather
than as GitHub-specific records. That keeps integrations thin: a new source adds
events to the protocol instead of rewriting the fold engine.

The canonical Node/Eve integration lives in canonical-hours. This package is the
portable kernel intended for downstream hosts, including workerd-style runtimes.
