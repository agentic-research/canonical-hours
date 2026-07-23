import { z } from "zod";
import { SnapshotSource, SnapshotValue, SnapshotValueSchema } from "@agentic-research/vespers-core";

/**
 * Raw OpenWeatherMap current-weather response — only the fields we consume.
 * Parsed inside the adapter (its own failure boundary, mirroring
 * github.ts/lectio.ts): drift throws loudly inside fetch() and becomes the
 * "weather" degradation at tick level, never a crash.
 */
const RawWeatherSchema = z.object({
  weather: z.array(z.object({ description: z.string() })).min(1),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
  }),
  dt: z.number(), // unix seconds — when the reading was true at the provider
});

export class WeatherSource implements SnapshotSource {
  name = "weather";
  private lastAsOf: string | null = null;

  constructor(
    private apiKey: string, // WEATHER_API_KEY — env-only secret, passed in by tick-entry.ts
    private location: string, // non-secret, from canonical-hours.toml [weather] location
    private fetchImpl: typeof fetch = fetch,
  ) {}

  async fetch(): Promise<SnapshotValue> {
    if (!this.apiKey) throw new Error("WEATHER_API_KEY is not set");
    const url =
      "https://api.openweathermap.org/data/2.5/weather" +
      `?q=${encodeURIComponent(this.location)}&units=imperial&appid=${this.apiKey}`;
    const res = await this.fetchImpl(url);
    if (!res.ok) throw new Error(`weather provider returned ${res.status}`);
    const raw = RawWeatherSchema.parse(await res.json());
    const asOf = new Date(raw.dt * 1000).toISOString();
    this.lastAsOf = asOf;
    return SnapshotValueSchema.parse({
      kind: "weather",
      label: `Weather — ${this.location}`,
      value: `${Math.round(raw.main.temp)}°F, ${raw.weather[0].description}`,
      detail: `feels like ${Math.round(raw.main.feels_like)}°F, humidity ${raw.main.humidity}%`,
      as_of: asOf,
    });
  }

  /** as_of of the last successful fetch this process, else null. */
  async freshness(): Promise<string | null> {
    return this.lastAsOf;
  }
}
