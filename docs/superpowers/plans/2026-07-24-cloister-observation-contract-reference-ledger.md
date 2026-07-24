# Cloister Observation Contract and Reference Ledger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish Cloister's portable observation schema, deterministic acceptance rules, and invariant-bearing in-memory reference ledger as the executable contract for later Durable Object, Queue, provider, and consumer implementations.

**Architecture:** Cap'n Proto at `wire/observation.capnp` is the type source of truth and generates strict TypeScript/Zod bindings. A small semantic layer validates host-owned provenance and derives deterministic IDs from provider event identity, while an in-memory `ReferenceObservationLedger` models atomic append/checkpoint and independent consumer cursors. Property, state-machine, schema-drift, and curated mutation tests make the model a falsifiable contract rather than an example implementation.

**Tech Stack:** TypeScript 5.7, Zod 4, Cap'n Proto, `leyline-schema-bridge`, Vitest under `@cloudflare/vitest-pool-workers`, `fast-check`, Taskfile, Cloister's canonical JSON and SHA-256 storage helpers.

**Implementation bead:** `cloister-711b44`

## Global Constraints

- Execute in an rsry-managed Cloister worktree for `cloister-711b44`; do not use the currently dirty Cloister checkout.
- Every commit starts with `[cloister-711b44]` and uses Conventional Commits.
- Taskfile is the executable source of truth; CI and operators invoke tasks rather than repeating their commands.
- The Cap'n Proto schema is the only hand-authored cross-runtime type definition. `src/generated/observation.zod.ts` is generated and committed.
- This phase adds no Durable Object class, Queue binding, provider adapter, credential lookup, scheduler, or Canonical Hours projection.
- `src/obs/log.ts` remains the operational logging helper. Semantic observations live under `src/observations/` to avoid overloading that name.
- Delivery semantics are at least once. Correctness depends on immutable accepted envelopes, deterministic identity, idempotent append, and monotonic cursors.
- Queue delivery is not represented in the reference ledger because it is advisory; the later delivery adapter must conform to the ledger behavior established here.
- Existing `task lint` and `task verify` must remain green.

---

## File Map

| File | Responsibility |
|---|---|
| `docs/adr/0056-observation-substrate.md` | Cloister-local decision record for observation ownership, invariants, and phase boundaries |
| `docs/adr/INDEX.md` | Generated ADR index containing ADR-0056 |
| `wire/observation.capnp` | Cross-runtime source schema for drafts, accepted envelopes, attachments, signatures, and receipts |
| `src/generated/observation.zod.ts` | Generated TypeScript interfaces and strict Zod schemas |
| `src/observations/contract.ts` | Semantic validation, canonical payload hashing, deterministic IDs, and host-side acceptance |
| `src/observations/reference-ledger.ts` | Substrate-free reference implementation of append/checkpoint/read/cursor semantics |
| `test/fixtures/observations/observation-fixtures.capnp` | Cap'n Proto constants used to prove source-schema semantics |
| `scripts/validate-observation-schema.mjs` | Cap'n Proto CLI → generated Zod equivalence check |
| `test/observations/contract.test.ts` | Generated-schema and semantic-contract tests |
| `test/observations/reference-ledger.test.ts` | Example tests for append, collision, checkpoint, read, cursor, receipt, and tenant isolation behavior |
| `test/observations/model.test.ts` | `fast-check` properties and command-model traces |
| `scripts/mutation-probe.mjs` | Curated observation-contract mutants that the new suites must kill |
| `Taskfile.yml` | Generation, drift, contract, property, mutation, and aggregate observation tasks |
| `package.json`, `pnpm-lock.yaml` | `fast-check` development dependency |

---

### Task 1: Record the Cloister Decision and Establish the Generated Schema

**Files:**
- Create: `docs/adr/0056-observation-substrate.md`
- Modify: `docs/adr/INDEX.md`
- Create: `wire/observation.capnp`
- Create: `test/fixtures/observations/observation-fixtures.capnp`
- Create: `test/observations/contract.test.ts`
- Modify: `Taskfile.yml`
- Generate: `src/generated/observation.zod.ts`

**Interfaces:**
- Produces: `ObservationDraft`, `ObservationEnvelope`, `SourceProvenance`, `Attachment`, `Authentication`, `ObservationReceipt`, and their generated `*Schema` exports.
- Consumes: existing `schema-bridge:build`, `adr:index`, and Vitest conventions.

- [ ] **Step 1: Write ADR-0056**

Create `docs/adr/0056-observation-substrate.md` with `status: Proposed`, links to ADR-0003, ADR-0048, ADR-0052, and the approved Canonical Hours design. State these decisions explicitly:

```markdown
## Decision

1. Cloister owns the portable observation envelope and receiving-ledger semantics.
2. Providers emit `ObservationDraft`; Cloister supplies tenant, route, observer
   identity, receive time, deterministic ID, payload hash, and authentication.
3. A receiving ledger is append-only and idempotent. The same observation ID
   with different immutable content is a collision, never a duplicate.
4. Provider checkpoints advance atomically with accepted appends. Consumer
   cursors advance atomically with consumer-owned projections.
5. Cloudflare Queues carries revision hints only and cannot affect correctness.
6. Retention is ledger-relative. Canonical envelopes and expiry receipts are
   distinct from optional content-addressed attachments.
```

The ADR's non-goals must exclude a new distributed log, exactly-once delivery, Durable Object persistence in this phase, and provider-specific schemas in the generic contract.

- [ ] **Step 2: Regenerate the ADR index**

Run:

```bash
task adr:index
task adr:index:check
```

Expected: ADR-0056 appears in `docs/adr/INDEX.md`; the check exits 0.

- [ ] **Step 3: Write a failing generated-contract test**

Create `test/observations/contract.test.ts`:

```ts
/// <reference types="@cloudflare/vitest-pool-workers/types" />
import { describe, expect, it } from "vitest";
import {
  ObservationDraftSchema,
  ObservationEnvelopeSchema,
  ObservationReceiptSchema,
} from "../../src/generated/observation.zod.js";

const bytes = (s: string) => new TextEncoder().encode(s);

describe("generated observation contract", () => {
  it("accepts the minimal draft shape and rejects unknown fields", () => {
    const draft = {
      subject: "pr:agentic-research/cloister#186",
      kind: "github.pull_request.review",
      eventTimeMs: 1_753_380_000_000,
      providerEventId: "github:review:987",
      payloadJson: bytes('{"state":"changes_requested"}'),
      attachment: { none: null },
    };
    expect(ObservationDraftSchema.parse(draft)).toEqual(draft);
    expect(() => ObservationDraftSchema.parse({ ...draft, token: "secret" })).toThrow();
  });

  it("exports accepted-envelope and receipt schemas", () => {
    expect(ObservationEnvelopeSchema).toBeDefined();
    expect(ObservationReceiptSchema).toBeDefined();
  });
});
```

- [ ] **Step 4: Run the test and verify the missing generated module fails**

Run:

```bash
pnpm exec vitest run test/observations/contract.test.ts
```

Expected: FAIL because `src/generated/observation.zod.ts` does not exist.

- [ ] **Step 5: Add the Cap'n Proto source schema**

Create `wire/observation.capnp` with append-only field numbering:

```capnp
@0xd8e7b76c31a4f290;

struct ObservationDraft {
  subject         @0 :Text;
  kind            @1 :Text;
  eventTimeMs     @2 :Int64;
  providerEventId @3 :Text;
  payloadJson     @4 :Data;
  attachment      @5 :Attachment;
}

struct SourceProvenance {
  observerName          @0 :Text;
  implementationVersion @1 :Text;
  instanceId            @2 :Text;
  providerEventId       @3 :Text;
  checkpointHash        @4 :Data;
}

struct ContentRef {
  digest           @0 :Data;
  mediaType        @1 :Text;
  availableUntilMs @2 :Int64;
  pinPolicy        @3 :PinPolicy;
}

enum PinPolicy {
  forbidden @0;
  allowed   @1;
  required  @2;
}

struct Attachment {
  union {
    none    @0 :Void;
    content @1 :ContentRef;
  }
}

struct Signature {
  algorithm @0 :Text;
  keyId     @1 :Text;
  bytes     @2 :Data;
}

struct Authentication {
  union {
    unsigned @0 :Void;
    signed   @1 :Signature;
  }
}

struct ObservationEnvelope {
  schemaVersion  @0  :UInt16;
  observationId @1  :Text;
  tenantId       @2  :Text;
  routeId        @3  :Text;
  subject        @4  :Text;
  kind           @5  :Text;
  eventTimeMs    @6  :Int64;
  observedTimeMs @7  :Int64;
  source         @8  :SourceProvenance;
  payloadJson    @9  :Data;
  payloadHash    @10 :Data;
  attachment     @11 :Attachment;
  authentication @12 :Authentication;
}

enum ReceiptOutcome {
  accepted    @0;
  duplicate   @1;
  quarantined @2;
  rejected    @3;
  skipped     @4;
  expired     @5;
}

struct ObservationReceipt {
  outcome        @0 :ReceiptOutcome;
  observationId @1 :Text;
  ledgerId       @2 :Text;
  ledgerRevision @3 :UInt64;
  recordedAtMs   @4 :Int64;
  reason         @5 :Text;
  policyId       @6 :Text;
  payloadHash    @7 :Data;
  authentication @8 :Authentication;
}
```

Add this fixture:

```capnp
@0xa8cbab8cc48d87d1;

using Observation = import "../../../wire/observation.capnp";

const draftCanonical :Observation.ObservationDraft = (
  subject = "pr:agentic-research/cloister#186",
  kind = "github.pull_request.review",
  eventTimeMs = 1753380000000,
  providerEventId = "github:review:987",
  payloadJson = 0x"7b 22 73 74 61 74 65 22 3a 22 63 68 61 6e 67 65 73 5f 72 65 71 75 65 73 74 65 64 22 7d",
  attachment = (none = void),
);
```

The relative import is intentional: it works in rsry worktrees whose directory is not literally named `cloister`.

- [ ] **Step 6: Add Taskfile generation and drift targets**

Add these tasks beside the existing `identity:zod` tasks, using the same temporary-directory and output-existence guard:

```yaml
  observer:generate:
    desc: "Generate strict TypeScript/Zod observation bindings from wire/observation.capnp."
    deps: [schema-bridge:build]
    cmds:
      - |
        set -eu
        TMPDIR=$(mktemp -d)
        trap 'rm -rf "$TMPDIR"' EXIT
        capnp compile -o./rs/target/release/capnpc-schema-bridge-zod:"$TMPDIR" wire/observation.capnp
        test -f "$TMPDIR/observation.zod.ts"
        mv -f "$TMPDIR/observation.zod.ts" src/generated/observation.zod.ts

  observer:check-generated:
    desc: "Fail when committed observation bindings drift from the Cap'n Proto source."
    deps: [schema-bridge:build]
    cmds:
      - |
        set -eu
        TMPDIR=$(mktemp -d)
        trap 'rm -rf "$TMPDIR"' EXIT
        capnp compile -o./rs/target/release/capnpc-schema-bridge-zod:"$TMPDIR" wire/observation.capnp
        test -f "$TMPDIR/observation.zod.ts"
        diff -u src/generated/observation.zod.ts "$TMPDIR/observation.zod.ts"
```

- [ ] **Step 7: Generate bindings and run the contract test**

Run:

```bash
task observer:generate
pnpm exec vitest run test/observations/contract.test.ts
task observer:check-generated
```

Expected: all commands exit 0.

- [ ] **Step 8: Commit the decision and schema**

```bash
git add docs/adr/0056-observation-substrate.md docs/adr/INDEX.md wire/observation.capnp test/fixtures/observations/observation-fixtures.capnp test/observations/contract.test.ts Taskfile.yml src/generated/observation.zod.ts
git commit -m "[cloister-711b44] feat(observation): define generated envelope contract"
```

---

### Task 2: Add Semantic Validation and Deterministic Host Acceptance

**Files:**
- Create: `src/observations/contract.ts`
- Modify: `test/observations/contract.test.ts`

**Interfaces:**
- Consumes: generated `ObservationDraft`, `ObservationEnvelope`, and schemas; `canonical`, `digestBytes`, and `Digest`.
- Produces:

```ts
export interface AcceptanceContext {
  tenantId: string;
  routeId: string;
  observerName: string;
  implementationVersion: string;
  instanceId: string;
  checkpointHash: Uint8Array;
  observedTimeMs: number;
  authentication: Authentication;
}

export function acceptObservation(
  draft: ObservationDraft,
  context: AcceptanceContext,
): Promise<ObservationEnvelope>;

export function assertObservationEnvelope(value: unknown): Promise<ObservationEnvelope>;
export function envelopeDigest(envelope: ObservationEnvelope): Promise<Digest>;
```

- [ ] **Step 1: Add failing semantic-contract tests**

Extend `test/observations/contract.test.ts` with tests proving:

```ts
it("derives the same ID across retries but different content is detectable", async () => {
  const a = await acceptObservation(draft, context);
  const retry = await acceptObservation({ ...draft }, context);
  const changed = await acceptObservation(
    { ...draft, payloadJson: bytes('{"state":"approved"}') },
    context,
  );

  expect(retry.observationId).toBe(a.observationId);
  expect(changed.observationId).toBe(a.observationId);
  expect(await envelopeDigest(changed)).not.toBe(await envelopeDigest(a));
});

it("rejects non-canonical payload JSON and a forged payload hash", async () => {
  await expect(
    acceptObservation({ ...draft, payloadJson: bytes('{ "b": 2, "a": 1 }') }, context),
  ).rejects.toThrow(/canonical JSON/);

  const accepted = await acceptObservation(draft, context);
  await expect(
    assertObservationEnvelope({ ...accepted, payloadHash: new Uint8Array(32) }),
  ).rejects.toThrow(/payloadHash/);
});
```

Also assert non-empty tenant, route, subject, kind, provider event ID, observer name, version, and instance; safe-integer millisecond timestamps; exactly 32 payload-hash bytes; and an observation ID matching `^[0-9a-f]{64}$`.

- [ ] **Step 2: Run the semantic tests and verify they fail**

Run:

```bash
pnpm exec vitest run test/observations/contract.test.ts
```

Expected: FAIL because `src/observations/contract.ts` and its exports do not exist.

- [ ] **Step 3: Implement canonical acceptance**

Create `src/observations/contract.ts`. Use generated schemas for structural parsing, then enforce semantic checks. The identity preimage must be exactly:

```ts
const identityPreimage = {
  schemaVersion: 1,
  observerName: context.observerName,
  providerEventId: draft.providerEventId,
  subject: draft.subject,
  kind: draft.kind,
};
```

Compute `observationId` as lowercase SHA-256 hex over Cloister's existing `canonical(identityPreimage)`. Do not include tenant, route, receive time, implementation version, checkpoint, or payload hash: the same provider event retains one identity across receiving ledgers and retries. A changed payload therefore creates an ID collision that the ledger must surface.

Validate `payloadJson` by parsing it, canonicalizing the parsed `CanonicalValue`, and byte-comparing the result with the supplied bytes. Compute `payloadHash` from those canonical bytes. Populate all host-owned envelope fields from `AcceptanceContext`, never from the draft.

`assertObservationEnvelope` must:

1. parse with `ObservationEnvelopeSchema`;
2. enforce semantic string, time, hash-length, and ID-format rules;
3. recompute and compare `payloadHash`;
4. recompute and compare `observationId`;
5. return the parsed envelope only after every check succeeds.

`envelopeDigest` must hash canonical JSON containing every immutable envelope field, encoding byte arrays as lowercase hex strings so canonicalization is cross-runtime and unambiguous.

- [ ] **Step 4: Run focused tests**

Run:

```bash
pnpm exec vitest run test/observations/contract.test.ts
task type-check
```

Expected: PASS.

- [ ] **Step 5: Commit semantic acceptance**

```bash
git add src/observations/contract.ts test/observations/contract.test.ts
git commit -m "[cloister-711b44] feat(observation): validate and identify accepted facts"
```

---

### Task 3: Implement Atomic Append and Provider Checkpoints in the Reference Ledger

**Files:**
- Create: `src/observations/reference-ledger.ts`
- Create: `test/observations/reference-ledger.test.ts`

**Interfaces:**
- Consumes: `ObservationEnvelope`, `ObservationReceipt`, `assertObservationEnvelope`, and `envelopeDigest`.
- Produces:

```ts
export interface ObserverCheckpoint {
  readonly version: number;
  readonly value: string;
}

export interface AppendRequest {
  readonly ledgerId: string;
  readonly tenantId: string;
  readonly observerInstanceId: string;
  readonly expectedCheckpointVersion: number;
  readonly nextCheckpoint: string;
  readonly envelopes: readonly ObservationEnvelope[];
  readonly recordedAtMs: number;
}

export interface StoredObservation {
  readonly revision: number;
  readonly envelope: ObservationEnvelope;
  readonly digest: Digest;
}

export interface AppendResult {
  readonly throughRevision: number;
  readonly checkpoint: ObserverCheckpoint;
  readonly accepted: readonly StoredObservation[];
  readonly duplicateIds: readonly string[];
  readonly receipts: readonly ObservationReceipt[];
}

export class CheckpointConflictError extends Error {}
export class ObservationCollisionError extends Error {}

export class ReferenceObservationLedger {
  observerCheckpoint(tenantId: string, observerInstanceId: string): ObserverCheckpoint;
  head(tenantId: string): number;
  appendAndCheckpoint(request: AppendRequest): Promise<AppendResult>;
}
```

- [ ] **Step 1: Write failing append/checkpoint tests**

Create `test/observations/reference-ledger.test.ts` with these cases:

```ts
it("atomically appends a batch and advances its observer checkpoint", async () => {
  const result = await ledger.appendAndCheckpoint({
    ledgerId: "local",
    tenantId: "tenant-a",
    observerInstanceId: "github-main",
    expectedCheckpointVersion: 0,
    nextCheckpoint: "page:2",
    envelopes: [first, second],
    recordedAtMs: NOW,
  });
  expect(result.accepted.map((x) => x.revision)).toEqual([1, 2]);
  expect(result.checkpoint).toEqual({ version: 1, value: "page:2" });
  expect(ledger.head("tenant-a")).toBe(2);
});

it("treats byte-identical retries as duplicates and still advances checkpoint", async () => {
  await ledger.appendAndCheckpoint(request({
    expectedCheckpointVersion: 0,
    nextCheckpoint: "page:1",
    envelopes: [first],
  }));
  const retry = await ledger.appendAndCheckpoint(request({
    expectedCheckpointVersion: 1,
    nextCheckpoint: "page:2",
    envelopes: [first],
  }));
  expect(retry.accepted).toEqual([]);
  expect(retry.duplicateIds).toEqual([first.observationId]);
  expect(retry.receipts[0]).toMatchObject({
    outcome: "duplicate",
    observationId: first.observationId,
    ledgerRevision: 1,
  });
  expect(retry.checkpoint).toEqual({ version: 2, value: "page:2" });
  expect(ledger.head("tenant-a")).toBe(1);
});

it("rejects one colliding ID without partially appending the rest of the batch", async () => {
  await ledger.appendAndCheckpoint(request({
    expectedCheckpointVersion: 0,
    nextCheckpoint: "page:1",
    envelopes: [first],
  }));
  await expect(ledger.appendAndCheckpoint(request({
    expectedCheckpointVersion: 1,
    nextCheckpoint: "page:2",
    envelopes: [third, changedFirst],
  }))).rejects.toBeInstanceOf(ObservationCollisionError);
  expect(ledger.head("tenant-a")).toBe(1);
  expect(ledger.readAfter("tenant-a", 0, 10).observations.map((x) => x.envelope.observationId))
    .toEqual([first.observationId]);
  expect(ledger.observerCheckpoint("tenant-a", "github-main"))
    .toEqual({ version: 1, value: "page:1" });
});

it("rejects a stale checkpoint version without changing ledger state", async () => {
  await ledger.appendAndCheckpoint(request({
    expectedCheckpointVersion: 0,
    nextCheckpoint: "page:1",
    envelopes: [first],
  }));
  await expect(ledger.appendAndCheckpoint(request({
    expectedCheckpointVersion: 0,
    nextCheckpoint: "stale",
    envelopes: [second],
  }))).rejects.toBeInstanceOf(CheckpointConflictError);
  expect(ledger.head("tenant-a")).toBe(1);
  expect(ledger.observerCheckpoint("tenant-a", "github-main"))
    .toEqual({ version: 1, value: "page:1" });
});
```

Include an empty-batch case proving a successful provider scan may advance its opaque checkpoint without creating an observation revision.

- [ ] **Step 2: Run the tests and verify the class is missing**

Run:

```bash
pnpm exec vitest run test/observations/reference-ledger.test.ts
```

Expected: FAIL because `ReferenceObservationLedger` does not exist.

- [ ] **Step 3: Implement preflight-then-commit append behavior**

Implement `ReferenceObservationLedger` with per-tenant state:

```ts
interface TenantState {
  head: number;
  byId: Map<string, StoredObservation>;
  ordered: StoredObservation[];
  checkpoints: Map<string, ObserverCheckpoint>;
  cursors: Map<string, number>;
  receipts: ObservationReceipt[];
}
```

`appendAndCheckpoint` must perform all validation before mutating state:

1. validate identifiers, versions, times, and that every envelope belongs to `request.tenantId`;
2. call `assertObservationEnvelope` and `envelopeDigest` for every envelope;
3. compare `expectedCheckpointVersion` with the current version;
4. classify existing equal digests as duplicates;
5. throw `ObservationCollisionError` for an existing ID with a different digest;
6. reject duplicate IDs with different digests inside the same submitted batch;
7. only then assign contiguous revisions, store accepted rows and receipts, and advance the checkpoint.

Use copy-on-write arrays/maps or fully computed mutation lists so no `await` occurs after the first state mutation.

Create one receipt per submitted envelope. An accepted receipt uses its newly assigned revision and `outcome: "accepted"`; a byte-identical retry uses the existing row's revision and `outcome: "duplicate"`. Both carry the envelope's observation ID and payload hash, the request's ledger and record time, empty `reason`/`policyId`, and `{ unsigned: null }` authentication. Signing, quarantine storage, explicit skip, and attachment-expiry execution belong to the durable-runtime phase; their schema variants are fixed here so that phase cannot invent competing shapes.

- [ ] **Step 4: Run append/checkpoint tests**

Run:

```bash
pnpm exec vitest run test/observations/reference-ledger.test.ts
task type-check
```

Expected: PASS.

- [ ] **Step 5: Commit the reference append model**

```bash
git add src/observations/reference-ledger.ts test/observations/reference-ledger.test.ts
git commit -m "[cloister-711b44] feat(observation): model atomic append checkpoints"
```

---

### Task 4: Add Tenant-Scoped Reads and Independent Consumer Cursors

**Files:**
- Modify: `src/observations/reference-ledger.ts`
- Modify: `test/observations/reference-ledger.test.ts`

**Interfaces:**
- Adds:

```ts
export interface ReadPage {
  readonly observations: readonly StoredObservation[];
  readonly throughRevision: number;
  readonly headRevision: number;
}

export class CursorBoundsError extends Error {}

readAfter(tenantId: string, afterRevision: number, limit: number): ReadPage;
consumerCursor(tenantId: string, consumerId: string): number;
advanceConsumerCursor(
  tenantId: string,
  consumerId: string,
  expectedRevision: number,
  nextRevision: number,
): boolean;
receipts(tenantId: string): readonly ObservationReceipt[];
```

- [ ] **Step 1: Write failing read and cursor tests**

Add cases that prove:

```ts
it("returns bounded pages strictly after the requested revision", async () => {
  const page = ledger.readAfter(TENANT, 1, 1);
  expect(page.observations.map((x) => x.revision)).toEqual([2]);
  expect(page.throughRevision).toBe(2);
  expect(page.headRevision).toBe(3);
});

it("advances two consumer cursors independently using compare-and-swap", async () => {
  expect(ledger.advanceConsumerCursor(TENANT, "canonical-hours", 0, 2)).toBe(true);
  expect(ledger.consumerCursor(TENANT, "vigil")).toBe(0);
  expect(ledger.advanceConsumerCursor(TENANT, "canonical-hours", 0, 3)).toBe(false);
});

it("rejects cursor regression and advancement beyond the tenant head", async () => {
  expect(() => ledger.advanceConsumerCursor(TENANT, "c", 2, 1)).toThrow(CursorBoundsError);
  expect(() => ledger.advanceConsumerCursor(TENANT, "c", 2, 4)).toThrow(CursorBoundsError);
});

it("does not expose another tenant's rows, head, cursor, or receipts", async () => {
  expect(ledger.head("tenant-b")).toBe(0);
  expect(ledger.readAfter("tenant-b", 0, 10).observations).toEqual([]);
  expect(ledger.consumerCursor("tenant-b", "canonical-hours")).toBe(0);
  expect(ledger.observerCheckpoint("tenant-b", "github-main"))
    .toEqual({ version: 0, value: "" });
  expect(ledger.receipts("tenant-b")).toEqual([]);
});
```

Also test `limit` as a positive integer and reject negative or non-integer revisions.

- [ ] **Step 2: Run the focused tests and verify they fail**

Run:

```bash
pnpm exec vitest run test/observations/reference-ledger.test.ts
```

Expected: FAIL because the read/cursor methods do not exist.

- [ ] **Step 3: Implement reads and cursor compare-and-swap**

Implement reads over the tenant's revision-ordered array. `throughRevision` is the last returned revision, or `afterRevision` for an empty page. Validate `afterRevision <= head`; a caller cannot use reads to manufacture a future position.

Implement cursor advancement in this order:

1. validate identifiers and integer revisions;
2. require `nextRevision >= expectedRevision`;
3. require `nextRevision <= tenant.head`;
4. compare the stored cursor, defaulting to 0, with `expectedRevision`;
5. update only on equality.

Return receipt arrays as frozen copies so callers cannot mutate ledger state.

- [ ] **Step 4: Run reference-ledger tests**

Run:

```bash
pnpm exec vitest run test/observations/reference-ledger.test.ts
task type-check
```

Expected: PASS.

- [ ] **Step 5: Commit read/cursor semantics**

```bash
git add src/observations/reference-ledger.ts test/observations/reference-ledger.test.ts
git commit -m "[cloister-711b44] feat(observation): model isolated consumer cursors"
```

---

### Task 5: Make the Invariants Property- and Model-Tested

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `test/observations/model.test.ts`

**Interfaces:**
- Consumes: `acceptObservation` and the complete `ReferenceObservationLedger`.
- Produces: randomized witnesses for idempotence, permutation convergence, atomic collision rejection, cursor monotonicity, and tenant isolation.

- [ ] **Step 1: Add `fast-check` through pnpm**

Run:

```bash
pnpm add -D fast-check
```

Expected: `package.json` and `pnpm-lock.yaml` change; no other package files change.

- [ ] **Step 2: Write the first failing property**

Create `test/observations/model.test.ts`:

```ts
/// <reference types="@cloudflare/vitest-pool-workers/types" />
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { acceptObservation } from "../../src/observations/contract.js";
import { ReferenceObservationLedger } from "../../src/observations/reference-ledger.js";

it("is idempotent for every generated retry batch", async () => {
  await fc.assert(fc.asyncProperty(
    fc.uniqueArray(fc.stringMatching(/^[a-z][a-z0-9-]{0,20}$/), { minLength: 1, maxLength: 20 }),
    async (eventIds) => {
      const ledger = new ReferenceObservationLedger();
      const envelopes = await Promise.all(eventIds.map(makeEnvelope));
      await ledger.appendAndCheckpoint(request(0, "p1", envelopes));
      const retry = await ledger.appendAndCheckpoint(request(1, "p2", envelopes));

      expect(ledger.head(TENANT)).toBe(envelopes.length);
      expect(new Set(retry.duplicateIds)).toEqual(new Set(envelopes.map((x) => x.observationId)));
    },
  ), { numRuns: 100 });
});
```

`makeEnvelope` must use fixed host context and canonical payload JSON; `request` must increase checkpoint versions exactly as shown.

- [ ] **Step 3: Temporarily introduce a duplicate-append defect and prove the property fails**

In the worktree only, change the existing-equal-digest branch to classify the envelope as accepted. Run:

```bash
pnpm exec vitest run test/observations/model.test.ts
```

Expected: FAIL with a generated counterexample where the head exceeds the unique event count. Revert the temporary defect immediately with `git diff`, a surgical edit, and `git diff --check`; do not use a destructive checkout command.

- [ ] **Step 4: Add permutation and atomicity properties**

Add properties asserting:

- appending one generated set in two different permutations yields equal sets of `(observationId, digest)`, even though ledger revisions differ;
- adding an envelope that collides with a seeded ID rejects the entire generated batch, preserving the pre-call head and checkpoint;
- any generated sequence of valid cursor advances is monotonic and bounded by head;
- operations generated for tenant A never change tenant B's head, rows, cursor, checkpoint, or receipts.

Each property uses at least 100 runs and prints the seed/path on failure through `fast-check`'s default reporter.

- [ ] **Step 5: Add a command-model test**

Model these commands with `fc.commands`:

```ts
type Model = {
  head: number;
  checkpointVersion: number;
  ids: Map<string, string>;
  cursors: Map<string, number>;
};

type Real = {
  ledger: ReferenceObservationLedger;
};
```

Commands must cover:

- append a new unique event;
- retry an existing event;
- attempt a stale checkpoint;
- read a bounded page;
- advance consumer A;
- advance consumer B;
- attempt cursor regression;
- attempt cursor advancement beyond head.

After every command, compare model head, checkpoint version, ID set, and both cursors with the real ledger.

- [ ] **Step 6: Run property/model and full focused suites**

Run:

```bash
pnpm exec vitest run test/observations/model.test.ts
pnpm exec vitest run test/observations
task type-check
```

Expected: PASS.

- [ ] **Step 7: Commit invariant tests**

```bash
git add package.json pnpm-lock.yaml test/observations/model.test.ts
git commit -m "[cloister-711b44] test(observation): model ledger invariants"
```

---

### Task 6: Prove Cap'n Proto Fixture and Generated-Zod Equivalence

**Files:**
- Create: `scripts/validate-observation-schema.mjs`
- Modify: `test/fixtures/observations/observation-fixtures.capnp`
- Modify: `Taskfile.yml`

**Interfaces:**
- Consumes: Cap'n Proto CLI JSON output and `ObservationDraftSchema`.
- Produces: `task observer:test-schema`, which fails if the source fixture and generated runtime validator disagree.

- [ ] **Step 1: Add a deliberately invalid fixture check**

In `scripts/validate-observation-schema.mjs`, first invoke:

```bash
capnp eval -I .. --no-standard-import \
  test/fixtures/observations/observation-fixtures.capnp draftCanonical -o json
```

Cap'n Proto JSON renders `Data` as number arrays and `Int64` as decimal strings. Convert `payloadJson` with `Uint8Array.from(value.payloadJson)` and convert `eventTimeMs` with `Number(value.eventTimeMs)`, rejecting a timestamp that is not a safe integer. Pass the converted object to `ObservationDraftSchema.parse`.

The script must also construct an invalid copy with an unknown `credential` key and assert `ObservationDraftSchema.safeParse(invalid).success === false`.

Use this complete control flow:

```js
import { execFileSync } from "node:child_process";
import { ObservationDraftSchema } from "../src/generated/observation.zod.ts";

const stdout = execFileSync(
  "capnp",
  [
    "eval",
    "--no-standard-import",
    "test/fixtures/observations/observation-fixtures.capnp",
    "draftCanonical",
    "-o",
    "json",
  ],
  { encoding: "utf8" },
);
const raw = JSON.parse(stdout);
const eventTimeMs = Number(raw.eventTimeMs);
if (!Number.isSafeInteger(eventTimeMs)) {
  throw new Error(`unsafe fixture eventTimeMs: ${raw.eventTimeMs}`);
}
const draft = {
  ...raw,
  eventTimeMs,
  payloadJson: Uint8Array.from(raw.payloadJson),
};
ObservationDraftSchema.parse(draft);

const invalid = { ...draft, credential: "must-not-cross-boundary" };
if (ObservationDraftSchema.safeParse(invalid).success) {
  throw new Error("generated ObservationDraftSchema accepted an unknown credential field");
}
console.log("OK — observation Cap'n Proto fixture matches generated Zod contract");
```

- [ ] **Step 2: Run the script before adding its Taskfile target**

Run:

```bash
node --import tsx scripts/validate-observation-schema.mjs
```

Expected: PASS with `OK — observation Cap'n Proto fixture matches generated Zod contract`.

- [ ] **Step 3: Add composable schema and test tasks**

Add:

```yaml
  observer:test-schema:
    desc: "Validate a real Cap'n Proto observation fixture through generated Zod."
    deps: [observer:check-generated]
    cmds:
      - "{{.NODE_TSX}} scripts/validate-observation-schema.mjs"

  observer:test-contract:
    desc: "Run deterministic observation contract and reference-ledger tests."
    cmds:
      - pnpm exec vitest run test/observations/contract.test.ts test/observations/reference-ledger.test.ts

  observer:test-property:
    desc: "Run observation property and command-model tests."
    cmds:
      - pnpm exec vitest run test/observations/model.test.ts

  observer:check:
    desc: "Deterministic local observation gate: schema drift/equivalence, examples, properties, and typecheck."
    deps: [observer:test-schema, observer:test-contract, observer:test-property, type-check]
```

Do not add provider, workerd-ledger, Queue, or remote-smoke tasks in this phase because there is no implementation for them yet.

- [ ] **Step 4: Run the aggregate contract gate twice**

Run:

```bash
task observer:check
task observer:check
```

Expected: both runs exit 0; the second run may use Task's content-hash cache but must not depend on ambient shell variables.

- [ ] **Step 5: Commit schema equivalence and Taskfile composition**

```bash
git add scripts/validate-observation-schema.mjs test/fixtures/observations/observation-fixtures.capnp Taskfile.yml
git commit -m "[cloister-711b44] test(observation): gate schema equivalence"
```

---

### Task 7: Add Curated Mutation Probes for Load-Bearing Invariants

**Files:**
- Modify: `scripts/mutation-probe.mjs`
- Modify: `Taskfile.yml`

**Interfaces:**
- Consumes: existing mutation probe runner and focused observation tests.
- Produces: `task observer:test-mutation` and `task observer:test-mutation:full`.

- [ ] **Step 1: Add observation mutants**

Append curated mutants whose IDs begin with `observation/`:

```js
{
  id: "observation/dedup:accept-duplicate",
  file: "src/observations/reference-ledger.ts",
  anchor: "duplicateIds.push(envelope.observationId);",
  replace: "pendingAccepted.push({ envelope, digest });",
  run: () => VITEST("test/observations/model.test.ts"),
  why: "a retry must not allocate a second revision",
},
{
  id: "observation/collision:trust-first-write",
  file: "src/observations/reference-ledger.ts",
  anchor: "throw new ObservationCollisionError(",
  replace: "duplicateIds.push(envelope.observationId); continue; throw new ObservationCollisionError(",
  run: () => VITEST("test/observations/reference-ledger.test.ts"),
  why: "same identity with changed immutable content must surface as a collision",
},
{
  id: "observation/cursor:allow-regression",
  file: "src/observations/reference-ledger.ts",
  anchor: "if (nextRevision < expectedRevision) {",
  replace: "if (false) {",
  run: () => VITEST("test/observations/model.test.ts"),
  why: "consumer cursors are monotonic",
},
{
  id: "observation/cursor:allow-beyond-head",
  file: "src/observations/reference-ledger.ts",
  anchor: "if (nextRevision > tenant.head) {",
  replace: "if (false) {",
  run: () => VITEST("test/observations/model.test.ts"),
  why: "a consumer cannot acknowledge facts that are not durable",
},
{
  id: "observation/checkpoint:skip-version-cas",
  file: "src/observations/reference-ledger.ts",
  anchor: "if (checkpoint.version !== request.expectedCheckpointVersion) {",
  replace: "if (false) {",
  run: () => VITEST("test/observations/reference-ledger.test.ts"),
  why: "overlapping observer runs cannot overwrite one another's checkpoint",
},
{
  id: "observation/tenant:read-global-log",
  file: "src/observations/reference-ledger.ts",
  anchor: "let tenant = this.tenants.get(tenantId);",
  replace: "let tenant = this.tenants.values().next().value as TenantState | undefined;",
  run: () => VITEST("test/observations/reference-ledger.test.ts"),
  why: "reads and cursors must remain tenant-scoped",
},
```

Keep `private tenant(tenantId: string)` implemented with the exact `let tenant = this.tenants.get(tenantId);` line, so the final mutant has one stable anchor. The replacement makes every lookup reuse the first tenant and must be killed by the tenant-isolation test.

- [ ] **Step 2: Run the observation mutant set**

Run from a clean worktree:

```bash
task mutate -- --only=observation/
```

Expected: every observation mutant reports `killed`; zero `SURVIVED` and zero `ERROR`.

- [ ] **Step 3: Add mutation Taskfile aliases**

Add:

```yaml
  observer:test-mutation:
    desc: "Run curated mutants for the observation contract and reference ledger."
    cmds:
      - task mutate -- --only=observation/

  observer:test-mutation:full:
    desc: "Run the repository's complete curated mutation matrix, including observations."
    cmds:
      - task mutate
```

These aliases are the surfaces later PR, nightly, and release workflows invoke. Do not duplicate mutant commands in workflow YAML.

- [ ] **Step 4: Run through the observation-specific Taskfile surface**

Run from the clean worktree:

```bash
task observer:test-mutation
```

Expected: every observation mutant reports `killed`; zero `SURVIVED` and zero `ERROR`. The mutation probe's existing runner tests already pin non-zero exit behavior for survivors, so this plan does not dirty the worktree to manufacture one.

- [ ] **Step 5: Commit mutation gates**

```bash
git add scripts/mutation-probe.mjs Taskfile.yml
git commit -m "[cloister-711b44] test(observation): require invariant-killing mutations"
```

---

### Task 8: Run the Full Gate and Hand Off the Executable Contract

**Files:**
- No new source files.
- Verify all files listed in the bead scope.

**Interfaces:**
- Produces: a clean branch whose acceptance commands are reproducible and whose bead comment records exact evidence.

- [ ] **Step 1: Run focused acceptance**

Run:

```bash
task observer:check
task observer:test-mutation
```

Expected: schema drift/equivalence, examples, properties, state-machine traces, type checking, and every observation mutant pass.

- [ ] **Step 2: Run Cloister's repository gates**

Run:

```bash
task lint
task verify
```

Expected: both exit 0. A new cross-runtime schema is substrate work, so `task verify` is mandatory.

- [ ] **Step 3: Confirm generated and working-tree state**

Run:

```bash
task observer:check-generated
git diff --check
git status --short
```

Expected: no schema drift or whitespace errors. Only intentional bead metadata may remain after all source commits.

- [ ] **Step 4: Add a bead evidence comment**

Run:

```bash
rsry bead comment add cloister-711b44 "Implemented the Cap'n Proto observation contract, generated Zod bindings, semantic acceptance/identity rules, invariant reference ledger, property/state-machine suite, schema equivalence check, and curated mutation probes. Evidence: task observer:check; task observer:test-mutation; task lint; task verify. Ready for reconciler verification."
```

Per Cloister's `AGENTS.md`, do not manually close the implementation bead; the reconciler verifies and closes it.

- [ ] **Step 5: Rebase, push, and confirm synchronization**

Run:

```bash
git pull --rebase
git push
git status --short --branch
```

Expected: push succeeds and the branch reports up to date with its remote.

## Follow-on Boundaries

The following are separate plans and beads, not hidden work inside `cloister-711b44`:

1. Durable Object SQLite implementation and differential traces against `ReferenceObservationLedger`.
2. Polling plus Cloudflare Queue revision wake-ups, including missed/duplicate notification tests.
3. GitHub and Linear observer-package extraction with capability-injected HTTP.
4. Canonical Hours projection and independent consumer cursor.
5. Rosary and Vigil adapters, including Rust binding generation from the same schema.
6. Cloister topology, remote conformance smoke, targeted PR mutation invocation, and full nightly/release mutation scheduling.
