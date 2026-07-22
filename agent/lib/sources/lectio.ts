import { z } from "zod";
import {
  Artifact,
  Classification,
  LifecycleEvent,
  Observation,
  Source,
  canonicalPrUri,
} from "@vespers/core";
import type { FetchWindow } from "@vespers/core";

/**
 * One raw memory_authored_activity `prs[]` entry. Shape confirmed against
 * lectio's own source (not docs) — see docs/lectio-api-notes.md for the
 * full citation trail. Loose at the edges; strict on what we read.
 */
export const LectioPrRecordSchema = z.looseObject({
  uri: z.string(), // "gh://owner/repo/pr/N"
  repo: z.string().nullable(), // "owner/repo", or null if unparseable
  number: z.number().nullable(),
  title: z.string().nullable(),
  state: z.string().nullable(), // PascalCase Debug format, e.g. "Open" | "Closed"
  merged: z.string().nullable(), // stringly-typed "true" | "false", not a real boolean
  new_items: z.array(
    z.looseObject({
      uri: z.string(),
      kind: z.string(), // "github/review" | "github/review_comment" — never a verdict
      author: z.string().nullable(),
      path: z.string().nullable(),
      preview: z.string().nullable(),
      observed_at_nanos: z.number(),
    }),
  ),
});
export type LectioPrRecord = z.infer<typeof LectioPrRecordSchema>;

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

/**
 * lectio is the soft/enrichment source; GitHub is the hard-verdict source
 * (design doc: "Review verdicts and merge/close events classified `hard`"
 * lives in sources/github.ts, not here). memory_authored_activity's
 * `new_items[].kind` is only ever "github/review" or "github/review_comment"
 * — lectio's gh adapter *does* capture a review's verdict internally
 * (gh.rs:394, metadata.state), but authored_activity's projection never
 * surfaces it (authored.rs:223-229). There is no kind this adapter could
 * ever classify hard from this tool, so classification is a constant.
 */
export function classifyLectioKind(_kind: string): Classification {
  return "soft";
}

// lectio's only two observed kinds from memory_authored_activity, mapped to
// the local Source protocol's vocabulary. No verdict-level aliasing here —
// lectio cannot distinguish approved/changes_requested/commented (see above).
const KIND_MAP: Record<string, string> = {
  "github/review": "review",
  "github/review_comment": "review_comment",
};

export function normalizeLectioKind(kind: string): string {
  return KIND_MAP[kind] ?? kind;
}

function nanosToIso(nanos: number): string {
  return new Date(Math.floor(nanos / 1_000_000)).toISOString();
}

export class LectioSource implements Source {
  name = "lectio";
  schema = LectioPrRecordSchema;

  constructor(private call: LectioCall) {}

  async fetch(window: FetchWindow): Promise<unknown[]> {
    // memory_authored_activity takes since_nanos only — there is no `until`
    // parameter; the window's end is implicitly "now" server-side
    // (authored.rs:92-107). since_nanos as a JS number loses sub-microsecond
    // precision above 2^53 ns (~104 days since epoch); harmless for a
    // window-start filter at this magnitude.
    const sinceNanos = Math.floor(window.since.getTime() * 1_000_000);
    const result = await this.call("memory_authored_activity", { since_nanos: sinceNanos });
    const prs = (result as { prs?: unknown[] }).prs;
    return Array.isArray(prs) ? prs : [];
  }

  mapToLifecycleEvent(raw: unknown): LifecycleEvent {
    const rec = LectioPrRecordSchema.parse(raw);
    if (!rec.repo || rec.number === null) {
      throw new Error(`lectio PR record missing repo/number for ${rec.uri}`);
    }
    const [owner, repoName] = rec.repo.split("/");
    const artifact: Artifact = {
      uri: canonicalPrUri(owner, repoName, rec.number),
      kind: "pr",
      repo: rec.repo.toLowerCase(),
      number: rec.number,
      title: rec.title ?? "",
      // lectio's gh adapter never stores a PR URL (gh.rs:753-761) — synthesize it.
      url: `https://github.com/${rec.repo}/pull/${rec.number}`,
    };
    const observations: Observation[] = rec.new_items.map((item) => ({
      artifact_uri: artifact.uri,
      at: nanosToIso(item.observed_at_nanos),
      author: item.author ?? "unknown",
      type: normalizeLectioKind(item.kind),
      payload: {
        preview: item.preview ?? "",
        lectio_uri: item.uri,
        path: item.path ?? "",
      },
      classification: classifyLectioKind(item.kind),
    }));
    return {
      artifact,
      observations,
      // lectio never claims needs_you or resolved on its own — those are
      // hard-source determinations (Task 5's fold/merge priority policy).
      // "active" is the safe ceiling: something happened, no verdict implied.
      state_hint: "active",
    };
  }

  async freshness(): Promise<string | null> {
    const result = await this.call("memory_list_sources", {});
    const sources =
      (result as { sources?: Array<{ last_observed_at_iso?: string | null }> }).sources ?? [];
    let latest: string | null = null;
    for (const s of sources) {
      if (s.last_observed_at_iso && (!latest || s.last_observed_at_iso > latest)) {
        latest = s.last_observed_at_iso;
      }
    }
    return latest;
  }
}
