#!/usr/bin/env node
// scripts/sync-server-json-version.mjs — canonical-hours-5d74fc.
//
// server.json's `version` field is committed, hand-maintainable data
// (external consumers — the MCP registry, cloister — read the raw file),
// so it can't be computed at runtime. This script is the "generate it"
// half of the fix: run it after bumping package.json's version so
// server.json never has to be hand-edited in lockstep. test/server-json.test.ts
// is the "catch it if you forget" half — it already asserted equality
// before this script existed; this doesn't replace that check, it just
// makes drift avoidable instead of only detectable.
import { readFileSync, writeFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const serverJsonRaw = readFileSync("server.json", "utf8");
const currentVersion = JSON.parse(serverJsonRaw).version;

if (currentVersion === pkg.version) {
  console.log(`server.json version already matches package.json (${pkg.version}) — nothing to do.`);
  process.exit(0);
}

// A targeted string replacement, not a JSON.parse/stringify round-trip —
// re-serializing the whole document would reformat every line (JSON.stringify
// can't reproduce the file's inline-object style), turning a one-value
// update into a full-file diff. This changes exactly the version line.
const VERSION_LINE_RE = /^(\s*"version"\s*:\s*)"[^"]*"(,?\s*)$/m;
if (!VERSION_LINE_RE.test(serverJsonRaw)) {
  console.error('server.json: could not find a `"version": "..."` line to replace.');
  process.exit(1);
}
const updated = serverJsonRaw.replace(VERSION_LINE_RE, (_match, prefix, suffix) => `${prefix}"${pkg.version}"${suffix}`);
writeFileSync("server.json", updated);
console.log(`server.json version updated to ${pkg.version}.`);
