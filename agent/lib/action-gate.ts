import { verifyDPoPToken } from "@agentic-research/dpop";

/** Structurally compatible with the MCP SDK's IsomorphicHeaders — declared
 * locally so this module doesn't reach into SDK-internal export paths. */
export type HeaderLookup = Record<string, string | string[] | undefined>;

export interface ActionGateContext {
  toolName: string;
  headers: HeaderLookup;
  /**
   * The request URL, normalized to origin+pathname (no query/fragment) —
   * required by `notmeDpopGate` to verify a DPoP proof's `htu` claim
   * (RFC 9449 §4.3, exact string match, no normalization done by the
   * verifier itself). Callers not using `notmeDpopGate` can omit it.
   */
  url?: string;
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

export interface ActionGateEnv {
  MCP_ACTION_TOKEN?: string;
  NOTME_URL?: string;
  NOTME_AUDIENCE?: string;
  NOTME_ISSUER?: string;
  NOTME_REQUIRED_SCOPE?: string;
}

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
  const max = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < max; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
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
  expectedToken: string | undefined,
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

const DPOP_AUTH_RE = /^DPoP\s+(.+)$/i;

export interface NotmeDpopGateOptions {
  /** notme's JWKS endpoint (e.g. "https://auth.notme.bot/.well-known/jwks.json").
   * Use `actionGateFromEnv` to derive this from NOTME_URL at the host boundary. */
  jwksUrl?: string;
  /**
   * Expected `aud` claim — REQUIRED by the vendored `verifyDPoPToken` itself
   * (notme-dffc5c: audience is now checked inside the SDK, not layered on
   * top here) — a token minted for a different resource server is rejected
   * before this function ever sees its claims.
   */
  audience: string;
  /** Expected `iss` claim, passed straight through to `verifyDPoPToken`.
   * Optional — omit to accept any issuer (useful for self-hosted notme
   * deployments under a different domain). */
  issuer?: string;
  /** If set, the token's space-separated `scope` claim must include this
   * value, or the call is denied. Optional — omit for "any valid caller". */
  requiredScope?: string;
  /** Skip the JWKS fetch and verify against this key directly — for tests
   * and for deployments that want to pin notme's signing key rather than
   * fetch it per call. Passed straight through to `verifyDPoPToken`. */
  publicKey?: CryptoKey;
  /** Replay check for the DPoP proof's jti — defaults to a shared
   * in-memory tracker (see `seenJtiTracker` below) when omitted. Tests
   * that want to assert replay behavior in isolation, or a future
   * deployment that wants a durable store, can inject their own. */
  seenJti?: (jti: string) => boolean | Promise<boolean>;
}

/**
 * Verifies a notme-issued DPoP-bound access token (RFC 9449) — genuine
 * proof-of-possession, not a static shared secret: a stolen `Authorization`
 * header alone is useless without the caller's DPoP private key, which
 * never leaves their process. See canonical-hours-f49482 for why DPoP
 * (not notme's mTLS bridge-cert path) is the right fit here — DPoP was
 * built for exactly this situation (an app framework, eve/Vercel, with no
 * TLS-server config exposure), not a fallback.
 *
 * `seenJti` (below, wired by `defaultActionGate`) closes what used to be a
 * documented limitation here: without it, a captured proof was only
 * rejected once its 60s freshness window elapsed, not immediately.
 */
export function notmeDpopGate(opts: NotmeDpopGateOptions): ActionGate {
  const jwksUrl = opts.jwksUrl;
  return async ({ toolName, headers, url }) => {
    if (!jwksUrl && !opts.publicKey) {
      return {
        allowed: false,
        reason: `NOTME_URL (or jwksUrl/publicKey) is not configured — ${toolName} is default-deny until it is set`,
      };
    }
    if (!url) {
      return { allowed: false, reason: "no request URL available to verify the DPoP proof against" };
    }
    const authHeader = headerValue(headers, "authorization");
    const dpopMatch = authHeader ? DPOP_AUTH_RE.exec(authHeader) : undefined;
    const proof = headerValue(headers, "dpop");
    if (!dpopMatch || !proof) {
      return { allowed: false, reason: "missing Authorization: DPoP <token> or DPoP <proof> header" };
    }
    try {
      const claims = await verifyDPoPToken({
        token: dpopMatch[1],
        proof,
        method: "POST",
        url,
        // jwksUrl is unused when publicKey is set, but the SDK type requires
        // the field — the guard above guarantees one of the two is real when
        // we reach here.
        jwksUrl: jwksUrl ?? "",
        publicKey: opts.publicKey,
        audience: opts.audience,
        issuer: opts.issuer,
        seenJti: opts.seenJti ?? seenJtiTracker.check,
        // notme mints `nbf: iat` on every access token and the SDK defaults to
        // zero skew tolerance, so a verifier whose clock trails auth.notme.bot
        // — which this is, running on separate infrastructure — rejects
        // perfectly good tokens. Bounded deliberately: it widens `exp` too.
        // cloister hit this as a live regression (notme-18450e).
        clockTolerance: 60,
      });
      if (opts.requiredScope && !claims.scope.split(/\s+/).includes(opts.requiredScope)) {
        return { allowed: false, reason: `token missing required scope "${opts.requiredScope}"` };
      }
      return { allowed: true };
    } catch (err) {
      return { allowed: false, reason: err instanceof Error ? err.message : String(err) };
    }
  };
}

/**
 * In-memory jti-seen tracker for `notmeDpopGate`'s replay hook. Not a
 * durable store (a process restart forgets everything) — but canonical-
 * hours runs as one long-lived Node process (`eve dev`/Nitro), not
 * stateless-per-request serverless, so an in-memory Map genuinely closes
 * the replay gap for the process's actual lifetime. Entries are pruned
 * past `TTL_MS` (well beyond `verifyDPoPToken`'s own 60s freshness
 * window — a proof past that window is rejected on `iat` alone, so
 * nothing useful survives to be pruned early).
 */
const seenJtiTracker = (() => {
  const TTL_MS = 120_000;
  const seenAt = new Map<string, number>();
  return {
    check(jti: string): boolean {
      const now = Date.now();
      for (const [key, ts] of seenAt) {
        if (now - ts > TTL_MS) seenAt.delete(key);
      }
      if (seenAt.has(jti)) return true;
      seenAt.set(jti, now);
      return false;
    },
  };
})();

/**
 * Picks the configured gate from a host-provided env object: `notmeDpopGate`
 * when `NOTME_URL` is set, `sharedSecretGate` otherwise. Not a breaking
 * migration — notme is "experimental, not audited" per its own README, so the
 * static-secret path stays the default until a deployment opts in explicitly.
 */
export function actionGateFromEnv(env: ActionGateEnv): ActionGate {
  const notmeUrl = env.NOTME_URL?.trim();
  if (notmeUrl) {
    const base = notmeUrl.replace(/\/+$/, "");
    return notmeDpopGate({
      jwksUrl: `${base}/.well-known/jwks.json`,
      audience: env.NOTME_AUDIENCE ?? "canonical-hours",
      issuer: env.NOTME_ISSUER,
      requiredScope: env.NOTME_REQUIRED_SCOPE,
    });
  }
  return sharedSecretGate(env.MCP_ACTION_TOKEN);
}

/**
 * Node/Eve convenience wrapper around `actionGateFromEnv`. In runtimes where
 * `process` is absent, this safely becomes default-deny instead of throwing
 * during module evaluation.
 */
export function defaultActionGate(): ActionGate {
  const env =
    (globalThis as typeof globalThis & { process?: { env?: ActionGateEnv } }).process?.env ?? {};
  return actionGateFromEnv(env);
}
