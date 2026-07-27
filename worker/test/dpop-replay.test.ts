/// <reference types="@cloudflare/vitest-pool-workers/types" />

import { SELF, env, runInDurableObject } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { signedDpopActionRequest } from "./dpop-fixture";

type ReplayLedgerBinding = {
  idFromName(name: string): DurableObjectId;
  get(id: DurableObjectId): DurableObjectStub;
};

function replayLedger(): ReplayLedgerBinding {
  return (env as typeof env & { CH_DPOP_LEDGER: ReplayLedgerBinding }).CH_DPOP_LEDGER;
}

function ledgerFor(name: string): DurableObjectStub {
  const binding = replayLedger();
  return binding.get(binding.idFromName(name));
}

describe("DPoP replay ledger", () => {
  it("allows exactly one concurrent HTTP use of a signed DPoP proof", async () => {
    const request = await signedDpopActionRequest();
    const responses = await Promise.all([SELF.fetch(request.clone()), SELF.fetch(request.clone())]);
    const messages = await Promise.all(responses.map(async (response) => {
      const body = await response.json() as { result?: { content?: Array<{ text?: string }> } };
      return body.result?.content?.[0]?.text;
    }));
    expect(messages.filter((message) => message === "GITHUB_TOKEN is not configured")).toHaveLength(1);
    expect(messages.filter((message) => message?.includes("DPoP proof replay"))).toHaveLength(1);
    const replayRows = await runInDurableObject(
      ledgerFor("default"),
      (_instance, state) => state.storage.sql.exec("SELECT COUNT(*) AS count FROM dpop_jti_ledger").one(),
    );
    expect(replayRows?.count).toBe(1);
  });

  it("records one of two concurrent uses of the same proof jti", async () => {
    const ledger = ledgerFor("direct-ledger-test");
    const request = () => ledger.fetch("https://canonical-hours-dpop-ledger.test/jti", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jti: "concurrent-proof-jti" }),
    });
    const results = await Promise.all([request(), request()]);
    expect(results.map((response) => response.status)).toEqual([200, 200]);
    const seen = await Promise.all(results.map(async (response) => (await response.json() as { seen: boolean }).seen));
    expect(seen.sort()).toEqual([false, true]);
  });
});
