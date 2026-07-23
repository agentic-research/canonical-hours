import { afterEach, describe, expect, it, vi } from "vitest";
import { agentPrompt, createInvokeAgent, type AgentTickInput } from "../agent/lib/invoke-agent";

const tickInput: AgentTickInput = {
  merged: [],
  freshness: [],
  degradations: [],
  window: {
    since: "2026-07-23T00:00:00.000Z",
    until: "2026-07-23T01:00:00.000Z",
  },
};

describe("createInvokeAgent", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("skips the Eve receive path when no Anthropic key is configured", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const receive = vi.fn();

    await createInvokeAgent({ receive: receive as never, appAuth: {} as never })(tickInput);

    expect(receive).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      "[pr-board] skipping model invocation: ANTHROPIC_API_KEY is unset",
    );
  });

  it("lets local runs force deterministic no-model behavior even when a key is present", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "anthropic-key");
    vi.stubEnv("CANONICAL_HOURS_NO_MODEL", "1");
    const receive = vi.fn();

    await createInvokeAgent({ receive: receive as never, appAuth: {} as never })(tickInput);

    expect(receive).not.toHaveBeenCalled();
  });

  it("uses the existing tick channel handoff when a model key is configured", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "anthropic-key");
    const receive = vi.fn(async () => undefined);
    const appAuth = { kind: "test-auth" };

    await createInvokeAgent({ receive: receive as never, appAuth: appAuth as never })(tickInput);

    expect(receive).toHaveBeenCalledOnce();
    const calls = receive.mock.calls as unknown as [unknown, Record<string, unknown>][];
    expect(calls[0]?.[1]).toMatchObject({
      message: agentPrompt(tickInput),
      target: {},
      auth: appAuth,
    });
  });
});
