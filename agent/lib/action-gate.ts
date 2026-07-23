import { timingSafeEqual } from "node:crypto";
import { verifyDPoPToken } from "./vendor/notme-dpop";

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

const DPOP_AUTH_RE = /^DPoP\s+(.+)$/i;

export interface NotmeDpopGateOptions {
  /** notme's JWKS endpoint (e.g. "https://auth.notme.bot/.well-known/jwks.json").
   * Defaults to `${NOTME_URL}/.well-known/jwks.json` when NOTME_URL is set. */
  jwksUrl?: string;
  /**
   * Expected `aud` claim — REQUIRED. `verifyDPoPToken` (vendored from notme,
   * see vendor/notme-dpop.ts) does not check audience itself — that's only
   * enforced on the non-DPoP `verifyAccessToken` path — so without this
   * check here, any valid notme-issued DPoP token minted for a *different*
   * resource server would also pass this gate (confused-deputy). Checked
   * manually below against `VerifiedTokenClaims.aud`.
   */
  audience: string;
  /** If set, the token's space-separated `scope` claim must include this
   * value, or the call is denied. Optional — omit for "any valid caller". */
  requiredScope?: string;
  /** Skip the JWKS fetch and verify against this key directly — for tests
   * and for deployments that want to pin notme's signing key rather than
   * fetch it per call. Passed straight through to `verifyDPoPToken`. */
  publicKey?: CryptoKey;
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
 * Known limitation, stated honestly: this does not track `jti` across
 * calls, so a captured proof is only rejected once its 60s freshness
 * window (enforced inside `verifyDPoPToken`) elapses — not immediately.
 * True replay-once semantics would need a persistent jti-seen store; the
 * vendored verifier's optional `kv` param is for JWKS caching, not that.
 */
export function notmeDpopGate(opts: NotmeDpopGateOptions): ActionGate {
  const jwksUrl =
    opts.jwksUrl ?? (process.env.NOTME_URL ? `${process.env.NOTME_URL}/.well-known/jwks.json` : undefined);
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
        // jwksUrl is unused when publicKey is set, but the vendored type
        // requires the field — the guard above guarantees one of the two
        // is real when we reach here.
        jwksUrl: jwksUrl ?? "",
        publicKey: opts.publicKey,
      });
      if (claims.aud !== opts.audience) {
        return { allowed: false, reason: `token audience mismatch: expected "${opts.audience}", got "${claims.aud}"` };
      }
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
 * Picks the configured gate: `notmeDpopGate` when `NOTME_URL` is set,
 * `sharedSecretGate` otherwise. Not a breaking migration — notme is
 * "experimental, not audited" per its own README, so the static-secret
 * path stays the default until a deployment opts in explicitly.
 */
export function defaultActionGate(): ActionGate {
  if (process.env.NOTME_URL) {
    return notmeDpopGate({
      audience: process.env.NOTME_AUDIENCE ?? "canonical-hours",
      requiredScope: process.env.NOTME_REQUIRED_SCOPE,
    });
  }
  return sharedSecretGate();
}
