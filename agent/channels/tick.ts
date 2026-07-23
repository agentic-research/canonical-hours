import { defineChannel } from "eve/channels";

/**
 * Internal-only receive() target for the pr-board schedule
 * (agent/schedules/pr-board.ts). Not reachable over HTTP — `routes` is
 * empty; nothing external ever calls this channel. Its only purpose is to
 * give the schedule handler something to `receive(tickChannel, {...})`
 * into, per the confirmed cross-channel-handoff pattern (docs/eve-api-notes.md
 * fact 2 — receive/send/appAuth from `agent/schedules/*` handlers).
 *
 * Why the `receive` hook blocks on the event stream: `send()` (backed by
 * `runtime.run()`) resolves once the run has *started* — the framework's
 * own `RunHandle` type is documented as "returned immediately... before
 * the step loop completes" (node_modules/eve/dist/src/channel/types.d.ts).
 * runTick's material-path retry logic (agent/lib/tick.ts) needs
 * invokeAgent's promise to resolve only once the agent's turn has actually
 * settled — otherwise it would read the board before the `board` tool call
 * had a chance to land. Rather than trust an ambiguous "resolves when
 * settled" claim about `receive()`'s own promise timing, this channel makes
 * that guarantee true by construction: it explicitly waits for
 * `session.completed` / `session.failed` on the session's own event stream
 * (both confirmed terminal events — node_modules/eve/dist/src/protocol/message.d.ts)
 * before returning.
 */
export default defineChannel({
  routes: [],
  async receive(input, { send }) {
    const session = await send(input.message, {
      auth: input.auth,
      continuationToken: `tick:${crypto.randomUUID()}`,
      mode: "task",
    });
    const stream = await session.getEventStream();
    const reader = stream.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value.type === "session.completed" || value.type === "session.failed") break;
      }
    } finally {
      reader.releaseLock();
    }
    return session;
  },
});
