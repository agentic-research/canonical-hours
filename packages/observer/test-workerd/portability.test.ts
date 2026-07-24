import { z } from "zod";
import { describe, expect, it } from "vitest";
import { ObservationPipeline } from "../src/index.js";

describe("workerd portability", () => {
  it("extracts and validates an observation batch inside a Workers runtime", async () => {
    const observer = new ObservationPipeline(
      {
        name: "github",
        async extract() {
          return {
            records: [{ id: "review:1", at: 1_753_380_000_000 }],
            nextCursor: "page:2",
          };
        },
      },
      {
        payloadSchema: z.object({ state: z.literal("approved") }),
        transform(raw) {
          return {
            subject: "pr:agentic-research/canonical-hours#186",
            kind: "github.pull_request.review",
            eventTimeMs: raw.at,
            providerEventId: raw.id,
            payload: { state: "approved" },
          };
        },
      },
    );

    const batch = await observer.observe({ config: {} });

    expect(batch.nextCursor).toBe("page:2");
    expect(batch.observations[0]?.providerEventId).toBe("review:1");
    expect(batch.observations[0]?.payload).toEqual({ state: "approved" });
  });
});
