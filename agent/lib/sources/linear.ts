// agent/lib/sources/linear.ts
import { z } from "zod";
import { Artifact, LifecycleEvent, Observation, Source, canonicalIssueUri } from "@agentic-research/vespers-core";
import type { FetchWindow } from "@agentic-research/vespers-core";
import { LinearIssuesQuerySchema } from "./generated/linear";

export const LinearIssueRecordSchema = z.looseObject({
  identifier: z.string(),
  title: z.string(),
  url: z.string(),
  priority: z.number().int(),
  team: z.string(),
  stateName: z.string(),
  stateType: z.string(), // triage | unstarted | started | backlog | completed | canceled
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type LinearIssueRecord = z.infer<typeof LinearIssueRecordSchema>;

const ISSUES_QUERY = `
  query($email: String!) {
    issues(filter: { assignee: { email: { eq: $email } } }, first: 250) {
      nodes {
        identifier
        title
        url
        priority
        createdAt
        updatedAt
        team { key }
        state { name type }
      }
    }
  }
`;

interface GqlIssue {
  identifier: string;
  title: string;
  url: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  team: { key: string };
  state: { name: string; type: string };
}
interface GqlIssuesResponse {
  data: { issues: { nodes: GqlIssue[] } };
  errors?: Array<{ message: string }>;
}

// P1/P2 per linear-escalation-triage's oncall sweep. Linear's own scale:
// 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low (confirmed live this session
// against the connected Linear MCP tool's own parameter schema).
const STALE_PRIORITIES = new Set([1, 2]);

export interface LinearStalenessConfig {
  triageStaleDays: number;
  triageAbandonedDays: number;
  todoStaleDays: number;
}

/**
 * Linear is the sole source of truth for issue artifacts — no other source
 * ever emits an `issue:` URI, so mergeEvents' cross-source dedup/priority
 * policy never has anything to reconcile for this source's records.
 */
export class LinearSource implements Source {
  name = "linear";
  schema = LinearIssueRecordSchema;

  constructor(
    private apiKey: string,
    private userEmail: string,
    private staleness: LinearStalenessConfig,
    private fetchImpl: typeof fetch = fetch,
    private now: () => Date = () => new Date(),
  ) {}

  private async graphqlRequest(query: string, variables: Record<string, unknown>): Promise<GqlIssuesResponse> {
    const res = await this.fetchImpl("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        // Linear's own convention: the raw API key, NOT "Bearer "-prefixed —
        // confirmed against rosary's working production client (src/linear.rs).
        Authorization: this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`linear graphql ${res.status}`);
    const json = (await res.json()) as GqlIssuesResponse;
    if (json.errors?.length) throw new Error(`linear graphql errors: ${json.errors.map((e) => e.message).join("; ")}`);
    LinearIssuesQuerySchema().parse(json.data);
    return json;
  }

  /**
   * Oncall-mode sweep (linear-escalation-triage skill): every status for the
   * configured assignee, not windowed by updatedAt — staleness is computed
   * from createdAt/updatedAt directly against `now`, not a fetch cursor.
   */
  async fetch(_window: FetchWindow): Promise<unknown[]> {
    const res = await this.graphqlRequest(ISSUES_QUERY, { email: this.userEmail });
    return res.data.issues.nodes.map((n) => ({
      identifier: n.identifier,
      title: n.title,
      url: n.url,
      priority: n.priority,
      team: n.team.key,
      stateName: n.state.name,
      stateType: n.state.type,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));
  }

  mapToLifecycleEvent(raw: unknown): LifecycleEvent {
    const rec = LinearIssueRecordSchema.parse(raw);
    const artifact: Artifact = {
      uri: canonicalIssueUri(rec.team, rec.identifier),
      kind: "issue",
      team: rec.team,
      identifier: rec.identifier,
      title: rec.title,
      url: rec.url,
    };

    const observations: Observation[] = [];
    if (rec.stateType === "completed" || rec.stateType === "canceled") {
      observations.push({
        artifact_uri: artifact.uri,
        at: rec.updatedAt, // no dedicated completedAt/canceledAt field; last-modified time is the accurate proxy
        author: "",
        type: "close",
        payload: {},
        classification: "hard",
      });
    }

    const nowMs = this.now().getTime();
    const ageDays = (iso: string) => Math.floor((nowMs - new Date(iso).getTime()) / 86_400_000);
    const isStalePriority = STALE_PRIORITIES.has(rec.priority);

    let reason: string | undefined;
    // Priority order per linear-escalation-triage's oncall sweep (§"Flag in
    // this order") — first match wins, exactly mirroring the skill's own
    // "top of stack" / "second" / "third" ranking.
    if (isStalePriority && rec.stateType === "triage" && ageDays(rec.createdAt) > this.staleness.triageStaleDays) {
      reason = `P${rec.priority} stuck in Triage for ${ageDays(rec.createdAt)}d`;
    } else if (isStalePriority && rec.stateType === "unstarted") {
      reason = `P${rec.priority} in Todo, not started`;
    } else if (rec.stateType === "triage" && ageDays(rec.createdAt) > this.staleness.triageAbandonedDays) {
      reason = `In Triage ${ageDays(rec.createdAt)}d — still ours?`;
    } else if (rec.stateType === "unstarted" && ageDays(rec.updatedAt) > this.staleness.todoStaleDays) {
      reason = `In Todo, untouched ${ageDays(rec.updatedAt)}d — done elsewhere?`;
    }

    return {
      artifact,
      observations,
      state_hint: reason ? "needs_you" : undefined,
      extra: reason ? { reason } : undefined,
    };
  }

  async freshness(): Promise<string | null> {
    return this.now().toISOString();
  }
}
