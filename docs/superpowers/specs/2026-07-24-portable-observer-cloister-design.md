# Portable Observers and the Cloister Observation Substrate

**Status:** Approved design

**Date:** 2026-07-24

**Bead:** `canonical-hours-bcfb49`

## Context

Canonical Hours currently owns GitHub and Linear source implementations and a
Canonical Hours-specific lifecycle observation type. An experimental
`packages/observer` package generalizes this as an Extract/Transform/Load
pipeline, including a `Loader` selected by the provider package.

That boundary is backwards. Provider observers should report facts without
choosing persistence or knowing their consumers. Cloister already owns the
declarative topology, tenancy, capability, and workerd/external-runtime seams
needed to host them. Rosary already demonstrates the intended semantic model:
an authenticated append-only observation set with deterministic folds.

The target resembles a small Kubernetes control/data-plane split:

- Cloister declarations resemble the control plane: observer instances,
  schedules, routes, policies, identities, and capabilities.
- The observation path resembles Fluent Forward only as a delivery plane:
  tagged facts, buffering, retry, fan-out, and receipts.

It is not a general streaming platform. Cloudflare Queues is a delivery and
wake-up adapter, not the source of truth.

## Goals

- Make GitHub, Linear, and future observers independently pluggable.
- Run the same observer contract locally and remotely.
- Preserve sufficient provenance to authenticate and replay accepted facts.
- Give each consumer an independent view and cursor.
- Keep credentials and outbound authority out of provider configuration.
- Make Queue loss, duplication, and reordering harmless to correctness.
- Make generation, verification, mutation testing, and CI repeatable through
  Taskfile targets.
- Align Canonical Hours, Cloister, Vigil, and Rosary around one observation
  envelope without forcing them to share projection vocabularies.

## Non-goals

- Building Kafka, etcd, or a general distributed log inside Cloister.
- Exactly-once delivery across providers, storage, Queues, and consumers.
- Reusing Tau, Pi, or another agent harness as the observation protocol.
- Making Cloudflare Queues the authoritative history.
- Requiring a universal retention period across decentralized participants.
- Moving task execution into the observation log. Claimable work remains a
  Rosary/beads concern.

## Chosen Architecture

### 1. Cloister-owned observation contract

Cloister owns the versioned cross-runtime observation envelope and the
normative storage semantics. A Cap'n Proto schema is the source of truth for
wire fields. TypeScript and Rust bindings are generated artifacts.

The envelope contains:

- a deterministic observation ID;
- tenant and route identity;
- canonical subject URI;
- observation kind and schema version;
- provider event time and receiving-ledger time;
- observer identity, implementation version, and instance identity;
- provider cursor or event identity when disclosure policy permits;
- canonical payload or a content-addressed payload reference;
- payload hash;
- authentication/signature material and receiving receipts;
- attachment availability, expiry, and pinning policy when applicable.

Ledger revision is not event time. It is a monotonic position assigned by one
receiving ledger and is meaningful only within that ledger.

Rosary may generate Rust bindings from this contract and adapt its existing
observation implementation to it. Canonical Hours' lifecycle `Observation`
remains a projection-domain type and does not compete with the transport
envelope.

### 2. Portable Observer SDK

An observer is a producer with one responsibility: turn provider-visible facts
into canonical envelopes.

Conceptually, an observer receives:

- its declared, non-secret configuration;
- an injected, scoped outbound capability;
- the last committed provider checkpoint;
- cancellation and bounded-batch controls;
- an emitter supplied by the Cloister runtime.

It emits zero or more deterministic observations and proposes its next
checkpoint. It does not select a loader, access a database, call Cloudflare
Queues, read credentials from the environment, or know which consumers exist.

The current generic `Extractor`/`Transformer`/`Loader` pipeline is not a
compatibility constraint. In particular, `Loader` is removed from the provider
boundary.

### 3. Provider packages

GitHub and Linear become separate observer packages. Each package owns:

- provider request and response schemas;
- pagination and provider checkpoint rules;
- rate-limit and retry interpretation;
- normalization into the shared envelope;
- deterministic identity derivation;
- fixture-based compatibility tests.

Provider packages accept injected HTTP/outbound authority. Raw API tokens are
not observer configuration and are never persisted in an observation.

Canonical Hours consumes these packages but does not own the generic
observation contract. Cloister can host the same packages under workerd or
bridge them to an external/OCI runtime through its declared topology.

### 4. Cloister runtime

Cloister declarations select observer instances, schedules, routes, tenancy,
retention, outbound capabilities, and consumers.

The runtime owns:

- serialized execution of one observer instance;
- durable observation append and deduplication;
- atomic provider-checkpoint advancement;
- independent consumer cursors;
- retention and attachment pinning policy;
- Queue and polling wake-up drivers;
- quarantine, skip, expiry, and delivery receipts;
- local and remote runtime bindings.

The initial durable implementation is a small append-only ledger over Durable
Object SQLite. The semantic interface is intentionally limited to idempotent
append, revision-based reads, and monotonic cursor operations.

### 5. Consumers and projectors

Canonical Hours, Vigil, and Rosary are independent consumers:

- Canonical Hours folds observations into its board and lifecycle vocabulary.
- Vigil evaluates declared conditions and reconciliation rules.
- Rosary may project qualifying facts into claimable work.

Each consumer owns its cursor and materialized projection. Consumers cannot
steal observations or advance one another's cursors. Tau, Pi, and other agent
harnesses may produce or consume adapted observations, but their internal event
formats do not define this contract.

## Authoritative Log and Advisory Wake-ups

The durable observation log is authoritative. A Cloudflare Queue message
contains only a ledger identity and a `throughRevision` hint. It announces that
data may be available; it is not the data's canonical copy.

This choice provides:

- fan-out without duplicating authoritative facts into one queue per consumer;
- replay beyond Cloudflare Queue retention;
- provenance independent of delivery;
- identical correctness with Queues enabled or disabled;
- local operation under Miniflare and remote operation on Cloudflare.

Polling is the repair path. Missing, duplicated, delayed, or reordered Queue
messages affect latency only. The runtime may persist a pending wake-up and
retry it through an alarm, but consumer polling is sufficient for correctness.

## Data Flow

1. Cloister schedules an observer instance from declared topology.
2. Cloister injects scoped outbound authority and the last committed provider
   checkpoint.
3. The observer fetches, validates, normalizes, and emits a bounded batch with
   deterministic IDs.
4. Cloister atomically appends new envelopes and advances the provider
   checkpoint. Existing IDs are successful no-ops.
5. After commit, Cloister emits an advisory wake-up for the committed revision.
6. Each consumer reads after its own cursor.
7. The consumer deterministically folds the batch, then atomically persists its
   projection and cursor.

There is no distributed transaction spanning the provider, ledger, Queue, and
consumer. Correctness comes from the two local atomic boundaries, deterministic
identity, and retry:

- provider checkpoint advances with durable append;
- consumer cursor advances with durable projection.

## Failure Semantics

- Delivery is at least once.
- Accepted observations are immutable.
- Duplicate observation IDs are idempotent successes.
- Provider event time and ledger revision are separate.
- Folds use domain timestamps and deterministic tie-breaking, not arrival order.
- Invalid provider data is quarantined with provenance and surfaced as a
  degradation.
- A consumer schema or fold failure stops only that consumer and leaves its
  cursor unchanged.
- Skipping an observation requires an explicit policy action and creates a
  receipt.
- One observer instance is serialized by its Cloister-owned durable runtime;
  provider packages do not implement distributed locking.
- Queue failure cannot cause observation loss or cursor advancement.

## Decentralized Retention and Ownership

Retention is relative to a participant's ledger and policy, not a universal
property of an observation.

- A provider advertises attachment availability, expiry, and whether a consumer
  may pin a copy.
- Route and tenant policy decide what a receiving Cloister accepts, retains,
  copies, or rejects.
- A consumer owns its cursor, materialized projection, and authorized pinned
  attachments.
- Cloister enforces declared policy and records the resulting receipts.

Defaults are conservative:

- retain the small canonical envelope in the receiving ledger without automatic
  expiry;
- do not copy large or raw provider attachments automatically;
- allow an authorized consumer to pin an attachment into its own namespace;
- allow route-level TTLs for privacy and storage constraints;
- after content expiry, retain only the minimal provenance receipt: identity,
  hashes, timestamps, applicable policy, and deletion reason;
- never advance a cursor as a side effect of retention cleanup.

Two consumers may retain different views while still proving that they observed
the same signed fact.

## Invariants

The implementation must preserve these properties:

1. Appending the same observation any number of times yields one accepted fact.
2. Accepted observations cannot be mutated.
3. Provider and consumer cursors are monotonic.
4. A provider checkpoint cannot exceed its durably appended revision.
5. A consumer cursor cannot exceed its durably committed projection.
6. Queue-driven and polling-only delivery converge on the same observation set
   and projection.
7. Any permutation or duplication of one observation set produces the same
   deterministic fold.
8. Payload expiry preserves the provenance receipt and content hash.
9. Tenant and consumer isolation applies to reads and cursor advancement.
10. Invalid, skipped, rejected, and expired data always produce an inspectable
    outcome; there is no silent discard.

## Test Strategy

Development is invariant-first. Each behavioral change starts with a failing
example, property, state-machine transition, or mutation survivor; implementation
then makes the smallest change needed before refactoring.

The suite includes:

- example tests for schemas and provider normalization;
- property-based generation of observations, duplicates, permutations, and
  policy combinations;
- model/state-machine traces checked against a deliberately small reference
  ledger;
- differential traces executed against in-memory and Durable Object
  implementations;
- injected crashes around both atomic persistence boundaries;
- local Cloudflare Queue delivery, duplication, retry, and loss;
- polling-only execution with Queues disabled;
- two or more independently advancing consumers;
- schema-compatibility fixtures for old envelopes;
- quarantine, explicit skip, retention, and provenance receipt behavior;
- mutation testing that removes transactions, breaks deduplication, regresses
  cursors, bypasses validation, weakens isolation, or makes Queue delivery
  authoritative.

Property, model, differential, and fault tests run on every pull request.
Targeted mutation testing covers changed observation-core files on pull
requests. The complete mutation matrix runs nightly and before release.

## Taskfile Contract

Taskfiles are the executable source of truth. CI workflows invoke these targets
and do not repeat their commands:

- `observer:generate` — generate bindings from the Cap'n Proto schema.
- `observer:check-generated` — fail on schema/binding drift.
- `observer:test-contract` — run reference interface and invariant tests.
- `observer:test-providers` — run fixture-based GitHub and Linear tests.
- `observer:test-property` — run property and state-machine tests.
- `observer:test-workerd` — run the ledger contract against Durable Object
  SQLite under Miniflare.
- `observer:test-queues` — run local Queue and polling-equivalence tests.
- `observer:test-mutation` — run targeted mutation tests.
- `observer:test-mutation:full` — run the complete mutation matrix.
- `observer:test-remote` — run an opt-in deployed Cloudflare smoke using the
  same conformance vectors.
- `observer:check` — compose generation and deterministic local pull-request
  gates.

The repository's existing `check` and `ci` targets compose `observer:check`.
Nightly and release workflows invoke `observer:test-mutation:full`.
Deployment workflows invoke `observer:test-remote` when Cloudflare credentials
are available. Live-provider tests remain explicit and opt-in.

No correctness, setup, or verification step depends on Claude/Codex hooks,
prompts, or ambient interactive shell state.

## Implementation Decomposition

This design spans multiple repositories and must land in independently
reviewable phases:

1. **Contract and reference model:** establish the Cloister-owned schema,
   generated bindings, reference ledger, invariants, and Taskfile conformance
   targets.
2. **Cloister durable runtime:** implement Durable Object SQLite storage,
   provider and consumer checkpoints, policy receipts, polling, and Queue
   wake-ups.
3. **Provider extraction:** replace Canonical Hours' experimental ETL package
   with GitHub and Linear observer packages using injected outbound authority.
4. **Canonical Hours projection:** adapt its lifecycle fold and board projector
   to consume the shared log through an independent cursor.
5. **Rosary and Vigil adapters:** align Rosary's existing observation schema and
   add Vigil reconciliation without coupling either system to Canonical Hours.
6. **Remote rollout:** declare the topology in Cloister, run the remote
   conformance smoke, and enable schedules only after local and remote traces
   converge.

Each phase receives its own implementation bead, bounded file scope, acceptance
condition, and implementation plan. The contract/reference-model phase lands
first; downstream packages do not invent temporary competing protocols.
