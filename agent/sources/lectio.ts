import { z } from "zod";
import {
  Artifact,
  Classification,
  FetchWindow,
  LifecycleEvent,
  LifecycleStateSchema,
  Observation,
  Source,
  canonicalPrUri,
} from "./source";

/** One raw memory_authored_activity record. Loose at the edges; strict on what we read. */
export const LectioActivityRecordSchema = z.looseObject({
  artifact: z.looseObject({
    uri: z.string(),
    kind: z.string(),
    metadata: z.looseObject({
      repo: z.string(), // "owner/repo"
      number: z.number(),
      title: z.string(),
      url: z.string(),
    }),
  }),
  observations: z.array(
    z.looseObject({
      observed_at: z.string(),
      author: z.string(),
      kind: z.string(),
      content: z.string().optional(),
      uri: z.string().optional(),
    }),
  ),
  state_hint: z.string().optional(),
});
export type LectioActivityRecord = z.infer<typeof LectioActivityRecordSchema>;

export type LectioCall = (tool: string, args: Record<string, unknown>) => Promise<unknown>;

/**
 * Real transport: one short-lived streamable-HTTP MCP session per call.
 * Auth is the lectio shared-secret token, sent as `x-lectio-token`
 * (constant-time compared server-side) — not an `Authorization: Bearer` header.
 */
export function createMcpLectioCall(url: string, token: string): LectioCall {
  return async (tool, args) => {
    const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
    const { StreamableHTTPClientTransport } = await import(
      "@modelcontextprotocol/sdk/client/streamableHttp.js"
    );
    const client = new Client({ name: "pr-board", version: "0.1.0" });
    const transport = new StreamableHTTPClientTransport(new URL(url), {
      requestInit: { headers: { "x-lectio-token": token } },
    });
    await client.connect(transport);
    try {
      const result = await client.callTool({ name: tool, arguments: args });
      const text = (result.content as Array<{ type: string; text?: string }>)
        .filter((c) => c.type === "text")
        .map((c) => c.text ?? "")
        .join("");
      return JSON.parse(text);
    } finally {
      await client.close();
    }
  };
}

const HARD_KINDS = new Set([
  "review",
  "review_approved",
  "review_changes_requested",
  "review_commented",
  "changes_requested",
  "approved",
  "comment",
  "merge",
  "close",
  "open",
]);

/** hard = provider ground truth observed through lectio; derived/* and unknowns = soft (soft only enriches). */
export function classifyLectioKind(kind: string): Classification {
  if (kind.startsWith("derived/")) return "soft";
  return HARD_KINDS.has(kind) ? "hard" : "soft";
}

// Finalized against recorded fixtures in Step 5 — extend, don't delete.
const KIND_ALIASES: Record<string, string> = {
  changes_requested: "review_changes_requested",
  approved: "review_approved",
  "review/changes_requested": "review_changes_requested",
  "review/approved": "review_approved",
};

export function normalizeLectioKind(kind: string): string {
  return KIND_ALIASES[kind] ?? kind;
}

export class LectioSource implements Source {
  name = "lectio";
  schema = LectioActivityRecordSchema;

  constructor(private call: LectioCall) {}

  async fetch(window: FetchWindow): Promise<unknown[]> {
    const result = await this.call("memory_authored_activity", {
      since: window.since.toISOString(),
      until: window.until.toISOString(),
    });
    if (Array.isArray(result)) return result;
    const records = (result as { records?: unknown[] }).records;
    return Array.isArray(records) ? records : [];
  }

  mapToLifecycleEvent(raw: unknown): LifecycleEvent {
    const rec = LectioActivityRecordSchema.parse(raw);
    const [owner, repo] = rec.artifact.metadata.repo.split("/");
    const artifact: Artifact = {
      uri: canonicalPrUri(owner, repo, rec.artifact.metadata.number),
      kind: "pr",
      repo: rec.artifact.metadata.repo.toLowerCase(),
      number: rec.artifact.metadata.number,
      title: rec.artifact.metadata.title,
      url: rec.artifact.metadata.url,
    };
    const observations: Observation[] = rec.observations.map((o) => ({
      artifact_uri: artifact.uri,
      at: o.observed_at,
      author: o.author,
      type: normalizeLectioKind(o.kind),
      payload: { preview: o.content ?? "", lectio_uri: o.uri ?? "" },
      classification: classifyLectioKind(o.kind),
    }));
    const hint = LifecycleStateSchema.safeParse(rec.state_hint);
    return { artifact, observations, state_hint: hint.success ? hint.data : undefined };
  }

  async freshness(): Promise<string | null> {
    const result = await this.call("memory_list_sources", {});
    const entries = Array.isArray(result) ? result : ((result as { sources?: unknown[] }).sources ?? []);
    let latest: string | null = null;
    for (const s of entries as Array<{ last_advanced_at?: string }>) {
      if (s.last_advanced_at && (!latest || s.last_advanced_at > latest)) {
        latest = s.last_advanced_at;
      }
    }
    return latest;
  }
}
