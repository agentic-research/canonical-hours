import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { WeatherSource } from "../agent/lib/sources/weather";

const fx = (name: string) =>
  JSON.parse(readFileSync(`test/fixtures/weather/${name}.json`, "utf8"));

function fakeFetch(body: unknown, status = 200): typeof fetch {
  return (async () => new Response(JSON.stringify(body), { status })) as typeof fetch;
}

describe("WeatherSource", () => {
  it("is registered under the name 'weather'", () => {
    expect(new WeatherSource("k", "Austin, TX", fakeFetch(fx("current"))).name).toBe("weather");
  });

  it("maps a provider response into a SnapshotValue, location interpolated into label", async () => {
    const source = new WeatherSource("k", "Austin, TX", fakeFetch(fx("current")));
    expect(await source.fetch()).toEqual({
      kind: "weather",
      label: "Weather — Austin, TX",
      value: "72°F, clear",
      detail: "feels like 75°F, humidity 40%",
      as_of: "2026-07-18T15:04:00.000Z",
    });
  });

  it("freshness is null before any fetch, the reading's as_of after a successful one", async () => {
    const source = new WeatherSource("k", "Austin, TX", fakeFetch(fx("current")));
    expect(await source.freshness()).toBeNull();
    await source.fetch();
    expect(await source.freshness()).toBe("2026-07-18T15:04:00.000Z");
  });

  it("throws loudly on provider schema drift (malformed fixture)", async () => {
    const source = new WeatherSource("k", "Austin, TX", fakeFetch(fx("malformed")));
    await expect(source.fetch()).rejects.toThrow();
  });

  it("throws on a non-200 provider response", async () => {
    const source = new WeatherSource("k", "Austin, TX", fakeFetch({}, 500));
    await expect(source.fetch()).rejects.toThrow(/500/);
  });

  it("throws when the API key is missing/empty (→ weather degradation at tick level)", async () => {
    const source = new WeatherSource("", "Austin, TX", fakeFetch(fx("current")));
    await expect(source.fetch()).rejects.toThrow(/WEATHER_API_KEY/);
  });
});
