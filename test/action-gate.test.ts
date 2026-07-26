import { describe, it, expect, beforeAll, vi } from "vitest";
import { actionGateFromEnv, sharedSecretGate, notmeDpopGate } from "../agent/lib/action-gate";
import { computeJwkThumbprint } from "@agentic-research/dpop";

describe("sharedSecretGate", () => {
  it("denies every call when no token is configured (default-deny)", async () => {
    const gate = sharedSecretGate(undefined);
    const verdict = await gate({ toolName: "resolve_addressed_review_threads", headers: {} });
    expect(verdict).toEqual({
      allowed: false,
      reason: "MCP_ACTION_TOKEN is not configured — resolve_addressed_review_threads is default-deny until it is set",
    });
  });

  it("denies a call with no Authorization header", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: {} });
    expect(verdict.allowed).toBe(false);
  });

  it("denies a call with a mismatched token", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: { authorization: "Bearer wrong" } });
    expect(verdict.allowed).toBe(false);
  });

  it("denies a malformed Authorization header (missing Bearer prefix)", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: { authorization: "s3cret" } });
    expect(verdict.allowed).toBe(false);
  });

  it("allows a call with the matching bearer token", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: { authorization: "Bearer s3cret" } });
    expect(verdict).toEqual({ allowed: true });
  });

  it("looks up the header case-insensitively", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: { Authorization: "Bearer s3cret" } });
    expect(verdict).toEqual({ allowed: true });
  });

  it("takes the first value when a header arrives as an array", async () => {
    const gate = sharedSecretGate("s3cret");
    const verdict = await gate({ toolName: "t", headers: { authorization: ["Bearer s3cret"] } });
    expect(verdict).toEqual({ allowed: true });
  });
});

describe("actionGateFromEnv", () => {
  it("uses the injected shared-secret env without reading process.env defaults", async () => {
    const gate = actionGateFromEnv({ MCP_ACTION_TOKEN: "s3cret" });
    const verdict = await gate({ toolName: "t", headers: { authorization: "Bearer s3cret" } });
    expect(verdict).toEqual({ allowed: true });
  });

  it("uses notme DPoP when a notme URL is injected", async () => {
    const gate = actionGateFromEnv({ NOTME_URL: "https://auth.notme.bot", NOTME_AUDIENCE: "canonical-hours-test" });
    const verdict = await gate({ toolName: "t", headers: {}, url: URL_ });
    expect(verdict).toEqual({
      allowed: false,
      reason: "missing Authorization: DPoP <token> or DPoP <proof> header",
    });
  });
});

// ── notmeDpopGate: real Web Crypto keys, no mocks — same pattern notme's
// own dpop-verifier.test.ts uses. publicKey bypasses the JWKS fetch, so
// these run with no network access. ──────────────────────────────────────

const AUDIENCE = "canonical-hours-test";
const URL_ = "https://canonical-hours.example/mcp";

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function b64urlStr(s: string): string {
  return b64url(new TextEncoder().encode(s));
}

async function generateEd25519(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey({ name: "Ed25519" } as any, true, ["sign", "verify"]) as Promise<CryptoKeyPair>;
}

async function generateP256(): Promise<{ keyPair: CryptoKeyPair; jwk: JsonWebKey }> {
  const keyPair = (await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  )) as CryptoKeyPair;
  const jwk = (await crypto.subtle.exportKey("jwk", keyPair.publicKey)) as JsonWebKey;
  return { keyPair, jwk };
}

async function mintToken(opts: {
  signingKey: CryptoKey;
  sub: string;
  jkt: string;
  scope?: string;
  audience?: string;
  expOverride?: number;
  iatOverride?: number;
  issuerOverride?: string;
}): Promise<string> {
  const header = { typ: "at+jwt", alg: "EdDSA", kid: "test-kid" };
  const iat = opts.iatOverride ?? Math.floor(Date.now() / 1000);
  const payload: Record<string, unknown> = {
    sub: opts.sub,
    iss: opts.issuerOverride ?? "https://auth.notme.bot",
    aud: opts.audience ?? AUDIENCE,
    iat,
    nbf: iat,
    exp: opts.expOverride ?? iat + 300,
    jti: crypto.randomUUID(),
    scope: opts.scope ?? "read",
    cnf: { jkt: opts.jkt },
  };
  const headerB64 = b64urlStr(JSON.stringify(header));
  const payloadB64 = b64urlStr(JSON.stringify(payload));
  const sig = new Uint8Array(
    await crypto.subtle.sign(
      "Ed25519" as any,
      opts.signingKey,
      new TextEncoder().encode(`${headerB64}.${payloadB64}`),
    ),
  );
  return `${headerB64}.${payloadB64}.${b64url(sig)}`;
}

async function buildProof(opts: {
  keyPair: CryptoKeyPair;
  jwk: JsonWebKey;
  token: string;
  htm: string;
  htu: string;
  payloadOverrides?: Record<string, unknown>;
}): Promise<string> {
  const header = { typ: "dpop+jwt", alg: "ES256", jwk: opts.jwk };
  const ath = b64url(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(opts.token)),
  );
  const payload = {
    jti: crypto.randomUUID(),
    htm: opts.htm,
    htu: opts.htu,
    iat: Math.floor(Date.now() / 1000),
    ath,
    ...opts.payloadOverrides,
  };
  const headerB64 = b64urlStr(JSON.stringify(header));
  const payloadB64 = b64urlStr(JSON.stringify(payload));
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    opts.keyPair.privateKey,
    new TextEncoder().encode(`${headerB64}.${payloadB64}`),
  );
  return `${headerB64}.${payloadB64}.${b64url(sig)}`;
}

describe("notmeDpopGate", () => {
  let edKp: CryptoKeyPair;
  let ecKp: CryptoKeyPair;
  let ecJwk: JsonWebKey;
  let jkt: string;

  beforeAll(async () => {
    edKp = await generateEd25519();
    const p256 = await generateP256();
    ecKp = p256.keyPair;
    ecJwk = p256.jwk;
    jkt = await computeJwkThumbprint(ecJwk);
  });

  async function verifyProof(
    token: string,
    proof: string,
    url = URL_,
    options: Parameters<typeof notmeDpopGate>[0] = { audience: AUDIENCE, publicKey: edKp.publicKey },
  ) {
    return notmeDpopGate(options)({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url,
    });
  }

  async function invokeGate(gate: ReturnType<typeof notmeDpopGate>, token: string, proof: string) {
    return gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
  }

  async function checkIatOffset(offset: number, allowed: boolean, now: number) {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: `agent-${offset}`, jkt });
    const proof = await buildProof({
      keyPair: ecKp,
      jwk: ecJwk,
      token,
      htm: "POST",
      htu: URL_,
      payloadOverrides: { iat: now + offset },
    });
    const verdict = await notmeDpopGate({
      audience: AUDIENCE,
      publicKey: edKp.publicKey,
    })({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict.allowed, `offset ${offset}`).toBe(allowed);
  }

  async function exerciseJtiValidation(
    gate: ReturnType<typeof notmeDpopGate>,
    token: string,
    proofJti: string,
    checked: string[],
  ) {
    const invalidProof = await buildProof({
      keyPair: ecKp,
      jwk: ecJwk,
      token,
      htm: "POST",
      htu: URL_,
      payloadOverrides: { jti: proofJti, ath: "invalid" },
    });
    const invalid = await invokeGate(gate, token, invalidProof);
    const checkedAfterInvalid = [...checked];
    const validProof = await buildProof({
      keyPair: ecKp,
      jwk: ecJwk,
      token,
      htm: "POST",
      htu: URL_,
      payloadOverrides: { jti: proofJti },
    });
    const valid = await invokeGate(gate, token, validProof);
    return { invalid, valid, checkedAfterInvalid };
  }

  async function runJtiValidationScenario() {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const proofJti = crypto.randomUUID();
    const checked: string[] = [];
    const gate = notmeDpopGate({
      audience: AUDIENCE,
      publicKey: edKp.publicKey,
      checkAndRecordJti: (candidate) => {
        checked.push(candidate);
        return false;
      },
    });
    const result = await exerciseJtiValidation(gate, token, proofJti, checked);
    return { ...result, checked, proofJti };
  }

  it("denies when neither NOTME_URL nor jwksUrl/publicKey is configured", async () => {
    const gate = notmeDpopGate({ audience: AUDIENCE });
    const verdict = await gate({ toolName: "t", headers: {}, url: URL_ });
    expect(verdict.allowed).toBe(false);
  });

  it("denies when no request URL is available", async () => {
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey });
    const verdict = await gate({ toolName: "t", headers: {} });
    expect(verdict.allowed).toBe(false);
  });

  it("denies a call with no Authorization/DPoP headers", async () => {
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey });
    const verdict = await gate({ toolName: "t", headers: {}, url: URL_ });
    expect(verdict.allowed).toBe(false);
  });

  it("allows a valid DPoP-bound token matching htm/htu/audience", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const proof = await buildProof({ keyPair: ecKp, jwk: ecJwk, token, htm: "POST", htu: URL_ });
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey });
    const verdict = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict).toEqual({ allowed: true });
  });

  it("denies a proof with no ath claim", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const proof = await buildProof({
      keyPair: ecKp,
      jwk: ecJwk,
      token,
      htm: "POST",
      htu: URL_,
      payloadOverrides: { ath: undefined },
    });
    const verdict = await verifyProof(token, proof);
    expect(verdict).toMatchObject({ allowed: false, code: "PROOF_ATH_MISSING" });
  });

  it("denies a proof whose ath is not the hash of the presented token", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const proof = await buildProof({
      keyPair: ecKp,
      jwk: ecJwk,
      token,
      htm: "POST",
      htu: URL_,
      payloadOverrides: { ath: "not-the-token-hash" },
    });
    const verdict = await notmeDpopGate({
      audience: AUDIENCE,
      publicKey: edKp.publicKey,
    })({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict).toMatchObject({ allowed: false, code: "PROOF_ATH_MISMATCH" });
  });

  it("denies token substitution even when both tokens are otherwise valid for the proof key", async () => {
    const boundToken = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const substitutedToken = await mintToken({ signingKey: edKp.privateKey, sub: "agent-2", jkt });
    const proof = await buildProof({
      keyPair: ecKp,
      jwk: ecJwk,
      token: boundToken,
      htm: "POST",
      htu: URL_,
    });
    const verdict = await notmeDpopGate({
      audience: AUDIENCE,
      publicKey: edKp.publicKey,
    })({
      toolName: "t",
      headers: { authorization: `DPoP ${substitutedToken}`, dpop: proof },
      url: URL_,
    });
    expect(verdict).toMatchObject({ allowed: false, code: "PROOF_ATH_MISMATCH" });
  });

  it("treats the DPoP htm claim as a strict case-sensitive HTTP method token", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const proof = await buildProof({
      keyPair: ecKp,
      jwk: ecJwk,
      token,
      htm: "post",
      htu: URL_,
    });
    const verdict = await notmeDpopGate({
      audience: AUDIENCE,
      publicKey: edKp.publicKey,
    })({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict).toMatchObject({ allowed: false, code: "PROOF_HTM_MISMATCH" });
  });

  it("canonicalizes htu by removing query and fragment before comparison", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const proof = await buildProof({
      keyPair: ecKp,
      jwk: ecJwk,
      token,
      htm: "POST",
      htu: `${URL_}?proof=one#proof-fragment`,
    });
    const verdict = await notmeDpopGate({
      audience: AUDIENCE,
      publicKey: edKp.publicKey,
    })({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: `${URL_}?request=two#request-fragment`,
    });
    expect(verdict).toEqual({ allowed: true });
  });

  it("accepts proof iat at both inclusive 60-second boundaries and rejects 61 seconds", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-24T20:00:00.000Z"));
    try {
      const now = Math.floor(Date.now() / 1000);
      for (const [offset, allowed] of [
        [-61, false],
        [-60, true],
        [60, true],
        [61, false],
      ] as const) {
        await checkIatOffset(offset, allowed, now);
      }
    } finally {
      vi.useRealTimers();
    }
  });

  it("denies a token whose aud doesn't match — confused-deputy guard", async () => {
    const token = await mintToken({
      signingKey: edKp.privateKey,
      sub: "agent-1",
      jkt,
      audience: "some-other-service",
    });
    const proof = await buildProof({ keyPair: ecKp, jwk: ecJwk, token, htm: "POST", htu: URL_ });
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey });
    const verdict = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict.allowed).toBe(false);
    expect((verdict as { code?: string }).code).toBe("CLAIM_AUD_MISMATCH");
  });

  it("denies an expired token", async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = await mintToken({
      signingKey: edKp.privateKey,
      sub: "agent-1",
      jkt,
      iatOverride: now - 700,
      expOverride: now - 400,
    });
    const proof = await buildProof({ keyPair: ecKp, jwk: ecJwk, token, htm: "POST", htu: URL_ });
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey });
    const verdict = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict.allowed).toBe(false);
  });

  it("denies a proof whose key doesn't match the token's cnf.jkt", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const { keyPair: wrongKp, jwk: wrongJwk } = await generateP256();
    const proof = await buildProof({ keyPair: wrongKp, jwk: wrongJwk, token, htm: "POST", htu: URL_ });
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey });
    const verdict = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict.allowed).toBe(false);
  });

  it("denies a proof bound to a different URL (htu mismatch)", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const proof = await buildProof({
      keyPair: ecKp,
      jwk: ecJwk,
      token,
      htm: "POST",
      htu: "https://canonical-hours.example/some-other-route",
    });
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey });
    const verdict = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict.allowed).toBe(false);
  });

  it("denies when the token lacks a required scope", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt, scope: "read" });
    const proof = await buildProof({ keyPair: ecKp, jwk: ecJwk, token, htm: "POST", htu: URL_ });
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey, requiredScope: "mcp:actions" });
    const verdict = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict.allowed).toBe(false);
  });

  it("allows when the token has the required scope among several", async () => {
    const token = await mintToken({
      signingKey: edKp.privateKey,
      sub: "agent-1",
      jkt,
      scope: "read mcp:actions write",
    });
    const proof = await buildProof({ keyPair: ecKp, jwk: ecJwk, token, htm: "POST", htu: URL_ });
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey, requiredScope: "mcp:actions" });
    const verdict = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict).toEqual({ allowed: true });
  });

  // notme-dffc5c / canonical-hours-f49482: issuer pin + replay hook, now
  // that verifyDPoPToken supports both directly.

  it("denies a token with the wrong issuer when issuer is pinned", async () => {
    const token = await mintToken({
      signingKey: edKp.privateKey,
      sub: "agent-1",
      jkt,
      issuerOverride: "https://not-auth.notme.bot",
    });
    const proof = await buildProof({ keyPair: ecKp, jwk: ecJwk, token, htm: "POST", htu: URL_ });
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey, issuer: "https://auth.notme.bot" });
    const verdict = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict.allowed).toBe(false);
    expect((verdict as { code?: string }).code).toBe("CLAIM_ISS_MISMATCH");
  });

  it("accepts a token with the pinned issuer", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const proof = await buildProof({ keyPair: ecKp, jwk: ecJwk, token, htm: "POST", htu: URL_ });
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey, issuer: "https://auth.notme.bot" });
    const verdict = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict).toEqual({ allowed: true });
  });

  it("denies a replayed proof when checkAndRecordJti atomically reports it seen", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const proof = await buildProof({ keyPair: ecKp, jwk: ecJwk, token, htm: "POST", htu: URL_ });
    const gate = notmeDpopGate({
      audience: AUDIENCE,
      publicKey: edKp.publicKey,
      checkAndRecordJti: () => true,
    });
    const verdict = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(verdict.allowed).toBe(false);
    expect((verdict as { code?: string }).code).toBe("PROOF_REPLAY");
  });

  it("does not record an invalid proof jti before all stateless validation succeeds", async () => {
    const { invalid, valid, checked, checkedAfterInvalid, proofJti } = await runJtiValidationScenario();
    expect(invalid.allowed).toBe(false);
    expect(checkedAfterInvalid).toEqual([]);
    expect(valid).toEqual({ allowed: true });
    expect(checked).toEqual([proofJti]);
  });

  it("rejects the second use of the same proof against the default (module-shared) replay tracker", async () => {
    const token = await mintToken({ signingKey: edKp.privateKey, sub: "agent-1", jkt });
    const proof = await buildProof({ keyPair: ecKp, jwk: ecJwk, token, htm: "POST", htu: URL_ });
    const gate = notmeDpopGate({ audience: AUDIENCE, publicKey: edKp.publicKey });
    const first = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(first).toEqual({ allowed: true });
    const replayed = await gate({
      toolName: "t",
      headers: { authorization: `DPoP ${token}`, dpop: proof },
      url: URL_,
    });
    expect(replayed.allowed).toBe(false);
    expect((replayed as { code?: string }).code).toBe("PROOF_REPLAY");
  });
});
