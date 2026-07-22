#!/usr/bin/env node
// Post-processes a @graphql-codegen output file to fix a confirmed
// upstream naming-convention bug: graphql-codegen-typescript-validation-schema's
// default-value generation for enum-typed input fields converts a schema
// default like "ROUND_ROBIN" into `EnumName.Round_Robin` (naive
// underscore-preserving title-case), but the "typescript" plugin's own
// enum member declarations use `RoundRobin` (pascalCase, no underscores —
// its documented default, `change-case-all#pascalCase`). The two don't
// match, so the generated `.default(EnumName.Round_Robin)` call references
// a member that doesn't exist, only `EnumName.RoundRobin` does — confirmed
// live via tsc --noEmit, and confirmed as the plugin's own inconsistency
// (its enum *declarations* already use the correct pascalCase convention;
// only this specific default-value code path doesn't).
//
// Scope, deliberately narrow: only rewrites `.default(EnumName.Word_Word)`
// call sites (the exact shape this bug produces), stripping underscores
// from the member name. Never touches anything else.
//
// Usage: node scripts/fix-codegen-enum-default-casing.mjs <file path>
import { readFileSync, writeFileSync } from "node:fs";

const filePath = process.argv[2];
if (!filePath) {
  console.error("usage: fix-codegen-enum-default-casing.mjs <file path>");
  process.exit(1);
}

const source = readFileSync(filePath, "utf8");
let fixCount = 0;

const fixed = source.replace(
  /\.default\((\w+)\.(\w+_\w[\w_]*)\)/g,
  (_fullMatch, enumName, memberName) => {
    fixCount += 1;
    const pascalMember = memberName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
    return `.default(${enumName}.${pascalMember})`;
  },
);

if (fixCount > 0) {
  writeFileSync(filePath, fixed);
  console.log(`fix-codegen-enum-default-casing: fixed ${fixCount} mismatched default-value reference(s) in ${filePath}`);
} else {
  console.log(`fix-codegen-enum-default-casing: no mismatches found in ${filePath}`);
}
