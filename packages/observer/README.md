# `@agentic-research/observer-core`

Portable, host-neutral contracts for turning provider records into validated
observation drafts.

An observer owns provider-facing work such as pagination, rate-limit handling,
response validation, and normalization. It returns facts plus its proposed next
cursor. The host owns credentials, persistence, cursor commits, scheduling,
delivery, and downstream projections.

That separation lets the same observer run directly in Canonical Hours today,
inside a Cloister workerd bundle later, or behind another host without changing
its provider logic.

## Install

```sh
pnpm add @agentic-research/observer-core
```

Within this repository, pnpm resolves the package from
`packages/observer` through the workspace protocol.

## Define an observer

```ts
import { z } from "zod";
import {
  ObservationPipeline,
  type Extractor,
  type Transformer,
} from "@agentic-research/observer-core";

interface Config {
  repo: string;
}

interface ReviewRecord {
  id: string;
  createdAtMs: number;
  state: unknown;
}

const extractor: Extractor<Config, ReviewRecord> = {
  name: "github",
  async extract({ config, cursor, signal }) {
    const page = await fetchReviews(config.repo, { cursor, signal });
    return {
      records: page.reviews,
      nextCursor: page.nextCursor,
    };
  },
};

const transformer: Transformer<ReviewRecord, {
  state: "approved" | "changes_requested";
}> = {
  payloadSchema: z.object({
    state: z.enum(["approved", "changes_requested"]),
  }),
  transform(review) {
    return {
      subject: "pr:agentic-research/canonical-hours#186",
      kind: "github.pull_request.review",
      eventTimeMs: review.createdAtMs,
      providerEventId: review.id,
      payload: { state: review.state },
    };
  },
};

const observer = new ObservationPipeline(extractor, transformer);
const batch = await observer.observe({
  config: { repo: "agentic-research/canonical-hours" },
  cursor: "page:1",
});
```

`batch.observations` contains schema-validated drafts.
`batch.nextCursor` is only a proposal: the host must not commit it until the
corresponding observations are durable.

Returning `null` from `transform()` intentionally filters a provider record.
Malformed observation metadata or payloads throw `ObservationValidationError`;
they are never logged-and-discarded silently.

## Observation identity and provenance

Every draft carries:

| Field | Meaning |
| --- | --- |
| `subject` | Canonical identity of the observed resource |
| `kind` | Versionable fact vocabulary, such as `github.pull_request.review` |
| `eventTimeMs` | Provider event time as a safe integer in Unix milliseconds |
| `providerEventId` | Stable provider-side event identity used for deduplication and provenance |
| `payload` | Provider-independent fact payload validated by the transformer schema |

The receiving host may add tenant, route, observer version, receipt,
authentication, and content-hash fields when it accepts the draft. Those fields
do not belong to the provider package.

## Vespers and Cloister

The dependency direction is:

```text
GitHub / Linear observer package
              ↓
         observer-core
          ↙          ↘
Canonical Hours      Cloister runtime
or Vespers adapter   and delivery
```

Vespers projects drafts into its own lifecycle `Observation` vocabulary; it
does not redefine the provider protocol. Cloister can consume this package from
the pnpm workspace now and can become the source repository later without
changing the npm package name or reversing the dependency direction.

## Cap'n Proto schema

`src/observation.capnp` ships with the npm package as the cross-runtime type
description for `ObservationDraft` and `ObservationBatch`. TypeScript callers
use the interfaces exported from this package; future Rust or Go consumers can
generate native types from the same schema.

## Verification

From the repository root:

```sh
task observer:check
```

This runs TypeScript compilation, unit tests, a published-entrypoint smoke test,
and a live Miniflare/workerd portability test. Release and CI workflows call
the same Taskfile surfaces. The package owns those tasks in this directory's
`Taskfile.yml`; the repository root imports it under the `observer:` namespace.
