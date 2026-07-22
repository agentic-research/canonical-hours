import { timingSafeEqual } from "node:crypto";

/** Structurally compatible with the MCP SDK's IsomorphicHeaders — declared
 * locally so this module doesn't reach into SDK-internal export paths. */
export type HeaderLookup = Record<string, string | string[] | undefined>;

export interface ActionGateContext {
  toolName: string;
  headers: HeaderLookup;
}

export type ActionGateVerdict = { allowed: true } | { allowed: false; reason: string };

/**
 * Authorizes one mutating MCP action-tool call. Pluggable by design
 * (canonical-hours-49ba33): a function type, not a fixed implementation — a
 * stronger check (e.g. verifying a lease certificate a proxy like cloister
 * might one day forward) can replace `sharedSecretGate` below without
 * touching the tools that call it.
 */
export type ActionGate = (ctx: ActionGateContext) => Promise<ActionGateVerdict> | ActionGateVerdict;

function headerValue(headers: HeaderLookup, name: string): string | undefined {
  const lower = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lower) return Array.isArray(value) ? value[0] : value;
  }
  return undefined;
}

/** Constant-time compare — a bearer token is a secret, and `!==` leaks
 * timing information proportional to the matching prefix length. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

const BEARER_RE = /^Bearer\s+(.+)$/i;

/**
 * Default-deny: with MCP_ACTION_TOKEN unset, every call is denied — not
 * silently allowed. Set it, and callers must send a matching
 * `Authorization: Bearer <token>` header. Eve's `defineTool` approval()
 * primitive doesn't apply here (it gates a model's own tool call inside an
 * eve session; these tools are called by external MCP clients over a
 * stateless HTTP channel, outside any session) — this is the deliberately
 * separate mechanism that covers that path instead.
 */
export function sharedSecretGate(
  expectedToken: string | undefined = process.env.MCP_ACTION_TOKEN,
): ActionGate {
  return ({ toolName, headers }) => {
    if (!expectedToken) {
      return {
        allowed: false,
        reason: `MCP_ACTION_TOKEN is not configured — ${toolName} is default-deny until it is set`,
      };
    }
    const raw = headerValue(headers, "authorization");
    const provided = raw ? BEARER_RE.exec(raw)?.[1] : undefined;
    if (!provided || !safeEqual(provided, expectedToken)) {
      return { allowed: false, reason: "missing or invalid Authorization: Bearer token" };
    }
    return { allowed: true };
  };
}
