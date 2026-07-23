# docs/

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — start here. The full design:
  the hard/soft classification split, why the tick is stateless, the
  zero-LLM-call short-circuit, a worked example tracing one PR through
  the whole pipeline, and the current verification matrix (what's
  proven live vs. still pending a real deployment).
- **[smell-gate.md](smell-gate.md)** — how the structural smell gate
  (ratcheted against `smell-baseline.json`) works, locally and in CI.
- **[eve-api-notes.md](eve-api-notes.md)**,
  **[lectio-api-notes.md](lectio-api-notes.md)** — implementation
  research notes on the eve and lectio APIs this project depends on,
  cited from the adapter code that reads them. Not user-facing
  documentation — background for whoever next touches `agent/lib/tick.ts`
  or `agent/lib/sources/lectio.ts` and needs to know *why* a given shape
  is handled the way it is.
- **smell-baseline.json** — data file, not prose; the smell gate's
  ratchet baseline. See smell-gate.md.

New to the repo? [GETTING_STARTED.md](../GETTING_STARTED.md) (repo root)
covers setup and everyday commands; this folder is reference material for
once you're past that.
