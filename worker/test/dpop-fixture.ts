const TEST_NOTME_PRIVATE_JWK: JsonWebKey = {
  kty: "OKP",
  crv: "Ed25519",
  // Ephemeral fixture key; never used by a Notme deployment.
  d: "tjlLzqccoiAWR-Rz1EL5V5wI9Q-5UEYwbZZQc2CMwYw",
  x: "q8_bmUwVjCrdQmoSC9UtCOpRaItgZ23ctfVZJXpe1Ss",
};

const TARGET = "https://canonical-hours.test/mcp";

function base64url(input: ArrayBuffer | Uint8Array): string {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function jsonPart(value: unknown): string {
  return base64url(new TextEncoder().encode(JSON.stringify(value)));
}

async function sha256(value: string): Promise<string> {
  return base64url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

async function signedAccessToken(jkt: string, now: number): Promise<string> {
  const key = await crypto.subtle.importKey("jwk", TEST_NOTME_PRIVATE_JWK, { name: "Ed25519" }, false, ["sign"]);
  const header = jsonPart({ typ: "at+jwt", alg: "EdDSA", kid: "worker-dpop-test-key" });
  const payload = jsonPart({ sub: "test-agent", iss: "https://notme.test", aud: "canonical-hours", iat: now, nbf: now, exp: now + 300, jti: crypto.randomUUID(), scope: "actions", cnf: { jkt } });
  const input = `${header}.${payload}`;
  return `${input}.${base64url(await crypto.subtle.sign("Ed25519" as any, key, new TextEncoder().encode(input)))}`;
}

async function signedProof(token: string, now: number, keys: CryptoKeyPair, jwk: JsonWebKey): Promise<string> {
  const header = jsonPart({ typ: "dpop+jwt", alg: "ES256", jwk });
  const payload = jsonPart({ jti: crypto.randomUUID(), htm: "POST", htu: TARGET, iat: now, ath: await sha256(token) });
  const input = `${header}.${payload}`;
  return `${input}.${base64url(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, keys.privateKey, new TextEncoder().encode(input)))}`;
}

async function proofCredentials(): Promise<{ jkt: string; keys: CryptoKeyPair; jwk: JsonWebKey }> {
  const proofKeys = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]) as CryptoKeyPair;
  const proofJwk = await crypto.subtle.exportKey("jwk", proofKeys.publicKey) as JsonWebKey;
  return {
    jkt: await sha256(JSON.stringify({ crv: proofJwk.crv, kty: proofJwk.kty, x: proofJwk.x, y: proofJwk.y })),
    keys: proofKeys,
    jwk: proofJwk,
  };
}

function actionRequest(token: string, proof: string): Request {
  return new Request(TARGET, {
    method: "POST",
    headers: { authorization: `DPoP ${token}`, dpop: proof, "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "resolve_addressed_review_threads", arguments: { pr: "agentic-research/canonical-hours#1" } } }),
  });
}

export async function signedDpopActionRequest(): Promise<Request> {
  const credentials = await proofCredentials();
  const now = Math.floor(Date.now() / 1000);
  const token = await signedAccessToken(credentials.jkt, now);
  return actionRequest(token, await signedProof(token, now, credentials.keys, credentials.jwk));
}
