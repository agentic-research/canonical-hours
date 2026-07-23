# eve API notes

Confirmed by reading `node_modules/eve/docs/` (eve v0.25.1, installed at
`~/github/art/canonical-hours/node_modules/eve`) and, where the docs prose
didn't spell out an import path verbatim, by reading the installed package's
`package.json` `exports` map and the matching `.d.ts` file. Not sourced from
public docs. These are the four facts later tasks depend on.

Bumped to eve 0.27.0 (canonical-hours-447a03): the 0.25.2 → 0.27.0 changelog
entries are all patch/minor changes to the TUI, Vercel/Nuxt deploy path,
compaction, and channel adapters — nothing touching schedules, MCP tool
registration, or the human-in-the-loop/approval APIs this doc describes.
The facts below were re-verified against the current install and still
hold.

## 1. Schedules (`agent/schedules/`) — used in Task 9

Source: `node_modules/eve/docs/schedules.mdx`

- Helper: `defineSchedule` imported from `eve/schedules`.
- File location determines the schedule name: `agent/schedules/billing/sweep.ts` → `"billing/sweep"`. Schedules are root-only (declared subagents cannot have a `schedules/` directory).
- Shape (verbatim from the docs):

  ```ts
  interface ScheduleDefinition {
    cron: string;
    markdown?: string; // fire-and-forget prompt (task mode)
    run?: (args: ScheduleHandlerArgs) => Promise<void> | void; // handler
  }

  interface ScheduleHandlerArgs {
    receive: CrossChannelReceiveFn; // hand the work off to a channel
    waitUntil: (task: Promise<unknown>) => void; // keep the cron task alive past return
    appAuth: SessionAuthContext; // pre-built app principal
  }
  ```

- Cron field name is `cron`: a standard 5-field string (`minute hour day-of-month month day-of-week`), minute granularity, evaluated in UTC on Vercel. Exactly one of `markdown` or `run` must be provided (`defineSchedule` itself is a type-level pass-through; the compiler enforces the one-of rule).
- `eve dev` never fires schedules on their cron cadence — trigger one manually via the dev-only dispatch route: `POST /eve/v1/dev/schedules/:scheduleId`.

## 2. Programmatic agent invocation — used in Task 9

Source: `node_modules/eve/docs/schedules.mdx`, `node_modules/eve/docs/channels/custom.mdx`, `node_modules/eve/docs/patterns/dynamic-scheduling.md`

From a schedule handler (`run({ receive, waitUntil, appAuth })`), the exact API for running the agent with a prompt/payload is:

```ts
receive(channel, { message, target, auth });
```

- `channel`: the target channel module's default export, imported directly from `agent/channels/<name>.ts` (identity matched by reference — e.g. `import slack from "../channels/slack"`).
- `message`: the prompt (string or structured content).
- `target`: channel-specific delivery target (e.g. `{ channelId: "C0123ABC" }` for Slack).
- `auth`: a `SessionAuthContext`. For agent-initiated work, pass the handler's own `appAuth` (`{ authenticator: "app", principalId: "eve:app", principalType: "runtime" }`).
- `receive(...)` returns a `Promise` — the dynamic-scheduling pattern doc shows `await receive(slack, {...})` inside a `try { ... } catch` block followed by `await scheduleStore.complete(job)`, i.e. **the promise resolves when the delivered session settles** (completes or fails), not merely when it starts. Wrap the call in `waitUntil(...)` so the cron invocation stays alive until the handoff (and any in-flight fetches) settle — `waitUntil` extends the cron task's lifetime past `return`.
- Same signature is available as `args.receive(channel, ...)` on custom-channel route handlers (`agent/channels/<name>.ts`), where it is documented as "hands inbound work to a different channel for cross-channel hand-off"; the target channel's authored `receive(input, { send })` hook owns the continuation-token format and initial state, and callers supply only `{ message, target, auth }`.
- For invocation from *outside* the eve process entirely (scripts, server-to-server, tests) rather than from within a schedule handler, the separate `eve/client` `Client` + `ClientSession` API applies instead: `client.session().send(message)` returns a `MessageResponse`, and `await response.result()` resolves to a `MessageResult` (`{ message, status, events, sessionId, data }`) once the turn completes (`status` is `"waiting" | "completed" | "failed"`).

**Caveat found in Task 9, not fully resolved by docs prose alone:** the claim above — that `receive(...)`'s promise "resolves when the delivered session settles" — rests on the *sequencing* of `dynamic-scheduling.md`'s example (`await receive(...)` followed by `await scheduleStore.complete(job)`), not on an explicit type-level guarantee. Reading the installed package's own types
(`node_modules/eve/dist/src/channel/types.d.ts`) complicates this: `Runtime.run(): Promise<RunHandle>` is documented as "Handle returned **immediately** by `runtime.run()` before the step loop completes" — i.e. `send()` (which wraps `run`/`deliver`) resolving does not, by itself, prove the turn (and any tool calls in it, like our `board` tool) has finished. Task 9 did not trust the ambiguous claim either way: `agent/channels/tick.ts`'s own `receive` hook explicitly reads the started session's `getEventStream()` until a `session.completed`/`session.failed` terminal event (both confirmed real event types in `node_modules/eve/dist/src/protocol/message.d.ts`) before returning, so `createInvokeAgent`'s cross-channel `receive()` call is guaranteed — by construction, not by trusting this doc's own prior claim — to resolve only once the pr-board agent's turn has actually settled. `runTick`'s material-path `readBoard()` check (`agent/lib/tick.ts`) depends on this.

## 3. HTTP status surface — used in Tasks 9 and 11

Source: `node_modules/eve/docs/channels/eve.mdx`, `node_modules/eve/docs/channels/custom.mdx`

The full built-in route list eve's default HTTP channel (`eveChannel()`, mounted under `/eve/v1/session*` and enabled even with no `agent/channels/eve.ts`) serves — confirmed both by this list and by our own `pnpm exec eve info` output:

- `GET /eve/v1/health`
- `GET /eve/v1/info` — JSON inspection snapshot (model, instructions, tools, skills, channels, schedules, subagents, sandbox, connections, hooks, workflow, workspace metadata)
- `POST /eve/v1/session` (start a session)
- `POST /eve/v1/session/:sessionId` (send a follow-up)
- `POST /eve/v1/session/:sessionId/cancel` (cancel the in-flight turn)
- `GET /eve/v1/session/:sessionId/stream` (stream events, NDJSON)
- Dev-only: `POST /eve/v1/dev/schedules/:scheduleId` (one-shot schedule dispatch; not mounted in production builds)

**There is no built-in route that serves workspace artifacts or "latest run output" as files.** `/eve/v1/info` returns JSON metadata about the agent, not file contents. `.output/` (from `eve info`'s "Output" field) is the build output directory, unrelated to runtime board artifacts.

**`board/` on disk — confirmed for both the deterministic paths and the material path.** `agent/lib/board.ts`'s `readBoard`/`writeBoardAtomic`, and the custom `GET /board` / `GET /board/md` route handlers in `agent/channels/board.ts`, all use plain host-process `node:fs` (`node:fs/promises`) directly — there is no sandbox indirection in that code path. This was live-verified end to end for the deterministic (all-clear and degraded-fallback) tick paths via `eve dev`: a real tick ran, `writeBoardAtomic` wrote `board/board.json` on the host filesystem, and `curl /board` on the host read back the same file. For those paths, the earlier claim that board files live in "the sandbox filesystem (`/workspace`), reached only through sandbox tools" was simply wrong — no sandbox is involved.

**RESOLVED (canonical-hours-3169e1): the material path writes to the same host filesystem, by construction — no deploy needed to prove it.** eve's own `docs/tools/overview.mdx` (installed package, v0.27.0, the version this repo pins) states this outright, first paragraph: "Tools run in your app runtime with full access to `process.env`, not in the sandbox." A tool only reaches the sandbox by explicitly calling `ctx.getSandbox()` — and `agent/tools/board.ts`'s `execute(input)` doesn't even take a `ctx` parameter, so it has no way to. Confirmed further by reading the actual code: `agent/tools/board.ts` (the material path's write) and `agent/lib/tick-entry.ts`'s `TickDeps.boardStore` (what `runTick`'s material-path `readBoard()` check uses) both import and share the exact same `nodeBoardStore` singleton from `agent/lib/node-board-store.ts` — not merely "the same kind of store," the same object, same process, same `BOARD_DIR`-resolved path. The earlier "UNVERIFIED... plausible given eve's sandbox backends" framing was speculation that hadn't yet been checked against eve's own docs; it hadn't been. No deploy-time smoke test is required — this is guaranteed by eve's documented tool-execution model, not by an empirical test that could pass today and regress tomorrow.

Server-route convention for a custom `GET /board` fallback (from `node_modules/eve/docs/channels/custom.mdx`): declare it as a route on a custom channel file under `agent/channels/<name>.ts`, using `defineChannel` + the `GET`/`POST`/`PUT`/`PATCH`/`DELETE`/`WS` route-verb helpers, all imported from `eve/channels`:

```ts
import { defineChannel, GET } from "eve/channels";

export default defineChannel({
  routes: [
    GET("/board", async (_req, args) => {
      // args: { send, cancel, getSession, receive, params, waitUntil, requestIp }
      return new Response(/* board contents */);
    }),
  ],
});
```

The route path (`"/board"`) is registered literally — no forced `/eve/v1` prefix is applied to custom-channel routes; only the built-in `eveChannel()` routes live under that prefix.

**Empirically confirmed in Task 9** by running `pnpm dev` against the built app (not just reading docs): a dotted route path such as `GET("/board.json", ...)` fails the Nitro/rolldown build with `[JSON_PARSE] expected value at line 1 column 1` — reproduced in isolation (a minimal single-route channel with a dotted path fails; the identical channel with `/board` instead of `/board.json` builds clean). Extensionless paths (`/board`, `/board/md`) build and serve correctly; confirmed live via `curl http://127.0.0.1:2000/board` and `.../board/md` returning the real `board.json`/board.md contents with `200`, and `404` before a board exists. Task 9's `agent/channels/board.ts` therefore uses `/board` (JSON) and `/board/md` (markdown), not the dotted paths the brief originally sketched. Root-caused as Nitro's static-asset/public-file convention almost certainly intercepting any path with a recognized file extension before it reaches the authored route table — not an eve-specific limitation, but binding on any custom-channel route path in this framework version. Route path convention for future custom channels: avoid dots in route segments.

Also empirically confirmed in Task 9: `pnpm exec eve dev`, then `curl -X POST http://127.0.0.1:2000/eve/v1/dev/schedules/<name>` genuinely dispatches the named schedule's `run()` handler end to end — verified against `agent/schedules/pr-board.ts` (cron `0 */4 * * *`), which ran `prBoardTick()` through to a real `writeBoardAtomic()` call (board.json content changed, `[pr-board] tick result: ...` logged) using dummy/unreachable lectio and GitHub credentials — both sources failed and were correctly recorded as `degradations` rather than crashing the tick, exactly matching the per-source try/catch degradation contract from Tasks 3–6.

## 4. Connections + sandbox — used in Tasks 3 and 7

Source: `node_modules/eve/docs/connections/mcp.mdx`, `node_modules/eve/docs/connections/overview.mdx`, `node_modules/eve/docs/sandbox.mdx`, and (where import paths weren't spelled out in docs prose) `node_modules/eve/package.json` `exports` map + matching `.d.ts` files.

**MCP connection config fields.** A remote MCP connection (`agent/connections/<name>.ts`) is created with `defineMcpClientConnection` (from `eve/connections`). Its confirmed fields, beyond `url` (already known from Task-1 planning):

- `description` (string) — read by the model via `connection_search`, not by us.
- `auth` — one of: `connect(...)` from `@vercel/connect/eve` (Vercel Connect OAuth), `{ getToken: async () => ({ token, expiresAt? }) }` (static/rotating token), or `defineInteractiveAuthorization({ getToken, startAuthorization, completeAuthorization })` from `eve/connections` (self-hosted OAuth). Can be a static object or a function of session context.
- `headers` — a static object or a function of session context, for non-Bearer auth schemes or extra server config.
- `tools` — `{ allow: string[] }` or `{ block: string[] }` (exactly one), narrowing which remote tools the model can discover.
- `approval` — `once()` / `always()` / `never()` from `eve/tools/approval`, or a custom function `({ session, toolName, toolInput, approvedTools }) => status`.

**There is no `type` discriminator field.** Connection kind (MCP vs. OpenAPI) is selected by which `define*` helper is called — `defineMcpClientConnection` vs. `defineOpenAPIConnection` (both from `eve/connections`) — not by a `type` property on a shared config object. (If the plan text assumed a `type` field, that assumption doesn't match the installed package — flagging this for whoever authors Task 3.)

**Sandbox backends and helpers**, confirmed via `sandbox.mdx` prose plus the package's `exports` map:

- `defineSandbox` and `defaultBackend` both live on `eve/sandbox` (top-level import: `import { defineSandbox, defaultBackend } from "eve/sandbox";`).
- Docker backend: `import { docker } from "eve/sandbox/docker";` — factory `docker({ image, env, pullPolicy, networkPolicy })`. Confirmed via `node_modules/eve/package.json` `exports["./sandbox/docker"]` → `dist/src/public/sandbox/docker.d.ts`, which re-exports `docker` from `#public/sandbox/backends/docker.js`. (The docs prose only shows the parallel `vercel()` import verbatim; `docker()`'s import path is documented in the backends table but not shown as a code sample, so it was confirmed from the installed package's exports map.)
- Vercel backend: `import { vercel } from "eve/sandbox/vercel";` — factory `vercel({ resources, networkPolicy, ... })`. Shown verbatim in `sandbox.mdx` and `guides/deployment.md`.
- Other backends, same pattern: `microsandbox()` from `eve/sandbox/microsandbox`, `justbash()` from `eve/sandbox/just-bash` (confirmed via package exports; note the hyphen in the just-bash subpath).
- With `backend` omitted on `defineSandbox`, eve uses `defaultBackend()`, which resolves in priority order: Vercel Sandbox (when `process.env.VERCEL` is set) → Docker (reachable daemon) → microsandbox (macOS/Apple Silicon or glibc Linux+KVM) → just-bash (dependency-free fallback).
