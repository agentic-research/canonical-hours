#!/usr/bin/env node
// Post-processes a @graphql-codegen output file to drop duplicate top-level
// `export enum X {...}` / `export type X = ...;` declarations, keeping only
// the first occurrence of each name.
//
// Why this exists (confirmed live, not guessed): combining the "typescript"
// and "typescript-operations" plugins in one file — the standard, common
// pairing used across the graphql-codegen ecosystem — double-declares any
// enum type selected inside an inline fragment on a union/interface field
// (e.g. `search(...) { ... on PullRequest { reviewDecision } }`). Verified
// in isolation with zero other plugins/config involved (a scratch repro:
// just ["typescript", "typescript-operations"] against canonical-hours'
// real github.graphql, nothing else), and independently confirmed that
// neither `enumsAsTypes`, `flattenGeneratedTypes`, nor removing either
// plugin individually resolves it without losing something else needed
// (input-type interfaces, or the operation result type itself). This is a
// real upstream limitation for this specific query shape, not a
// configuration mistake — filed nowhere upstream by this project, but
// reproducible and stable across regenerations.
//
// Usage: node scripts/dedupe-codegen-enums.mjs <file path>
import { readFileSync, writeFileSync } from "node:fs";

const filePath = process.argv[2];
if (!filePath) {
  console.error("usage: dedupe-codegen-enums.mjs <file path>");
  process.exit(1);
}

const source = readFileSync(filePath, "utf8");

// Blank-line-delimited blocks — matches graphql-codegen's own output
// formatting (one declaration, optionally preceded by a /** doc */
// comment, then a blank line before the next).
const blocks = source.split(/\n\n/);
const seenNames = new Set();
const deduped = [];
let droppedCount = 0;

for (const block of blocks) {
  const match = block.match(/(?:^|\n)export (?:enum|type) (\w+)\b/);
  if (!match) {
    deduped.push(block);
    continue;
  }
  const name = match[1];
  if (seenNames.has(name)) {
    droppedCount += 1;
    continue;
  }
  seenNames.add(name);
  deduped.push(block);
}

if (droppedCount > 0) {
  writeFileSync(filePath, deduped.join("\n\n"));
  console.log(`dedupe-codegen-enums: dropped ${droppedCount} duplicate declaration(s) from ${filePath}`);
} else {
  console.log(`dedupe-codegen-enums: no duplicates found in ${filePath}`);
}
