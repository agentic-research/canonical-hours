import { z } from "zod";
import { describe, expect, it } from "vitest";
import {
  ObservationPipeline,
  ObservationValidationError,
  type Extractor,
  type Transformer,
} from "../src/index.js";

interface Config {
  readonly repo: string;
}

interface RawEvent {
  readonly id: string;
  readonly at: number;
  readonly state?: string;
}

const extractor: Extractor<Config, RawEvent> = {
  name: "github",
  async extract({ config, cursor }) {
    expect(config).toEqual({ repo: "agentic-research/canonical-hours" });
    expect(cursor).toBe("page:1");
    return {
      records: [
        { id: "review:1", at: 1_753_380_000_000, state: "approved" },
        { id: "ignored", at: 1_753_380_000_001 },
      ],
      nextCursor: "page:2",
    };
  },
};

const transformer: Transformer<RawEvent, { state: "approved" | "changes_requested" }> = {
  payloadSchema: z.object({
    state: z.enum(["approved", "changes_requested"]),
  }),
  transform(raw) {
    if (raw.state === undefined) return null;
    return {
      subject: "pr:agentic-research/canonical-hours#186",
      kind: "github.pull_request.review",
      eventTimeMs: raw.at,
      providerEventId: raw.id,
      payload: { state: raw.state },
    };
  },
};

describe("ObservationPipeline", () => {
  it("returns validated drafts and the provider cursor without loading them", async () => {
    const observer = new ObservationPipeline(extractor, transformer);

    const batch = await observer.observe({
      config: { repo: "agentic-research/canonical-hours" },
      cursor: "page:1",
    });

    expect(observer.name).toBe("github");
    expect(batch.nextCursor).toBe("page:2");
    expect(batch.observations).toEqual([
      {
        subject: "pr:agentic-research/canonical-hours#186",
        kind: "github.pull_request.review",
        eventTimeMs: 1_753_380_000_000,
        providerEventId: "review:1",
        payload: { state: "approved" },
      },
    ]);
  });

  it("returns the payload parsed by the transformer schema", async () => {
    const coercing: Transformer<RawEvent, { count: number }> = {
      payloadSchema: z.object({ count: z.coerce.number().int() }),
      transform(raw) {
        return {
          subject: "issue:art/art-1",
          kind: "linear.issue.updated",
          eventTimeMs: raw.at,
          providerEventId: raw.id,
          payload: { count: "2" },
        };
      },
    };
    const observer = new ObservationPipeline(
      {
        name: "linear",
        async extract() {
          return { records: [{ id: "issue:1", at: 1 }] };
        },
      },
      coercing,
    );

    const batch = await observer.observe({ config: { repo: "unused" } });

    expect(batch.observations[0]?.payload).toEqual({ count: 2 });
  });

  it("fails loudly on an invalid payload instead of advancing the cursor", async () => {
    const invalid: Transformer<RawEvent, { state: "approved" }> = {
      payloadSchema: z.object({ state: z.literal("approved") }),
      transform(raw) {
        return {
          subject: "pr:o/r#1",
          kind: "github.pull_request.review",
          eventTimeMs: raw.at,
          providerEventId: raw.id,
          payload: { state: "changes_requested" },
        };
      },
    };
    const observer = new ObservationPipeline(
      {
        name: "github",
        async extract() {
          return {
            records: [{ id: "review:1", at: 1 }],
            nextCursor: "must-not-be-returned",
          };
        },
      },
      invalid,
    );

    await expect(observer.observe({ config: { repo: "o/r" } })).rejects.toMatchObject({
      name: "ObservationValidationError",
      observerName: "github",
      recordIndex: 0,
    } satisfies Partial<ObservationValidationError>);
  });

  it.each([
    ["empty subject", { subject: "" }],
    ["empty kind", { kind: "" }],
    ["empty provider event id", { providerEventId: "" }],
    ["unsafe event time", { eventTimeMs: Number.MAX_SAFE_INTEGER + 1 }],
  ])("rejects invalid provenance metadata: %s", async (_label, override) => {
    const observer = new ObservationPipeline(
      {
        name: "github",
        async extract() {
          return { records: [{ id: "review:1", at: 1 }] };
        },
      },
      {
        payloadSchema: z.object({ ok: z.literal(true) }),
        transform(raw) {
          return {
            subject: "pr:o/r#1",
            kind: "github.pull_request.review",
            eventTimeMs: raw.at,
            providerEventId: raw.id,
            payload: { ok: true },
            ...override,
          };
        },
      },
    );

    await expect(observer.observe({ config: { repo: "o/r" } }))
      .rejects.toBeInstanceOf(ObservationValidationError);
  });
});
