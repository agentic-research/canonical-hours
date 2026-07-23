import { describe, expect, it, vi } from "vitest";
import { applyEnvFile, runOneTick } from "../scripts/run-tick";

describe("run-tick script", () => {
  const noEnvFile = async () => {
    const err = new Error("missing .env") as Error & { code: string };
    err.code = "ENOENT";
    throw err;
  };

  it("forces no-model mode by default and refuses accidental model invocation", async () => {
    const env: Record<string, string | undefined> = {};
    const tick = vi.fn(async (runtime) => {
      await expect(runtime.receive()).rejects.toThrow("model invocation is disabled");
      expect(env.CANONICAL_HOURS_NO_MODEL).toBe("1");
      return "degraded_fallback" as const;
    });

    const result = await runOneTick({ env, tick, readEnvFile: noEnvFile });

    expect(result).toBe("degraded_fallback");
    expect(tick).toHaveBeenCalledOnce();
  });

  it("preserves an explicit no-model setting from the caller", async () => {
    const env: Record<string, string | undefined> = {
      CANONICAL_HOURS_NO_MODEL: "true",
    };
    const tick = vi.fn(async () => "all_clear" as const);

    await runOneTick({ env, tick, readEnvFile: noEnvFile });

    expect(env.CANONICAL_HOURS_NO_MODEL).toBe("true");
  });

  it("loads .env before loading the default tick module", async () => {
    const env: Record<string, string | undefined> = {};
    const tick = vi.fn(async () => "all_clear" as const);
    const loadTick = vi.fn(async () => {
      expect(env.GITHUB_TOKEN).toBe("from-dotenv");
      return tick;
    });

    await runOneTick({
      env,
      loadTick,
      readEnvFile: async () => "GITHUB_TOKEN=from-dotenv\n",
    });

    expect(loadTick).toHaveBeenCalledOnce();
    expect(tick).toHaveBeenCalledOnce();
  });

  it("parses .env without overwriting explicit shell values", () => {
    const env: Record<string, string | undefined> = {
      GITHUB_TOKEN: "from-shell",
    };

    applyEnvFile(
      [
        "GITHUB_TOKEN=from-dotenv",
        "LECTIO_TOKEN='quoted value'",
        'WEATHER_API_KEY="quoted-weather"',
        "COMMENTED=ok # keep this whole value simple",
        "EMPTY_COMMENTED=  # comment after blank value",
      ].join("\n"),
      env,
    );

    expect(env.GITHUB_TOKEN).toBe("from-shell");
    expect(env.LECTIO_TOKEN).toBe("quoted value");
    expect(env.WEATHER_API_KEY).toBe("quoted-weather");
    expect(env.COMMENTED).toBe("ok");
    expect(env.EMPTY_COMMENTED).toBe("");
  });
});
