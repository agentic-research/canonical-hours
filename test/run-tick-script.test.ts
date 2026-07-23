import { describe, expect, it, vi } from "vitest";
import { runOneTick } from "../scripts/run-tick";

describe("run-tick script", () => {
  it("forces no-model mode by default and refuses accidental model invocation", async () => {
    const env: Record<string, string | undefined> = {};
    const tick = vi.fn(async (runtime) => {
      await expect(runtime.receive()).rejects.toThrow("model invocation is disabled");
      expect(env.CANONICAL_HOURS_NO_MODEL).toBe("1");
      return "degraded_fallback" as const;
    });

    const result = await runOneTick({ env, tick });

    expect(result).toBe("degraded_fallback");
    expect(tick).toHaveBeenCalledOnce();
  });

  it("preserves an explicit no-model setting from the caller", async () => {
    const env: Record<string, string | undefined> = {
      CANONICAL_HOURS_NO_MODEL: "true",
    };
    const tick = vi.fn(async () => "all_clear" as const);

    await runOneTick({ env, tick });

    expect(env.CANONICAL_HOURS_NO_MODEL).toBe("true");
  });
});
