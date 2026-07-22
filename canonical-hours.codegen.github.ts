import type { CodegenConfig } from "@graphql-codegen/cli";

// Split into two generated files, not one — the documented pattern for
// combining the third-party validation-schema plugin with real TS type
// declarations (node_modules/graphql-codegen-typescript-validation-schema/dist/types/config.d.ts's
// own `importFrom` doc example shows this exact two-file shape). Combining
// "typescript" + "typescript-operations" + the validation-schema plugin
// into ONE file double-declares every enum: the validation-schema plugin's
// ZodSchemaVisitor independently emits its own complete `enumDeclarations`
// (dist/esm/zod/index.js's `EnumTypeDefinition` visitor), wholly separate
// from "typescript"'s own enum output — confirmed live via tsc --noEmit
// (first "Enum declarations can only merge with namespace or other enum
// declarations", then "Duplicate identifier" once enumsAsTypes matched
// both copies byte-for-byte), not assumed. Splitting into separate files
// means same-name declarations in different files never collide, and
// `importFrom` pulls in exactly the input/interface/object types the
// validation-schema plugin doesn't self-declare (enums aren't part of that
// import list — confirmed by reading its source: enum handling pushes into
// a separate `enumDeclarations` array, never `importTypes`).
const config: CodegenConfig = {
  schema: "node_modules/@octokit/graphql-schema/schema.graphql",
  documents: ["agent/lib/sources/github.graphql"],
  generates: {
    "agent/lib/sources/generated/github-types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        // Must match the schemas file's enumsAsTypes below: the zod
        // validators infer enum-typed fields as string-literal unions
        // (enumsAsTypes: true), so the TS interfaces they're checked
        // against (Properties<T>) need the same shape, not a real TS enum
        // — confirmed live via tsc --noEmit (real error: a zod validator's
        // inferred `"first" | "last"` wasn't assignable to a field typed
        // `InputMaybe<PaginationNulls>`, the real enum), not assumed.
        enumsAsTypes: false,
        scalars: {
          DateTime: "string",
          URI: "string",
          Date: "string",
          GitObjectID: "string",
          GitRefname: "string",
          Base64String: "string",
        },
      },
    },
    "agent/lib/sources/generated/github.ts": {
      plugins: ["graphql-codegen-typescript-validation-schema"],
      config: {
        schema: "zod",
        withOperationType: true,
        importFrom: "./github-types",
        enumsAsTypes: false,
        scalars: {
          DateTime: "string",
          URI: "string",
          Date: "string",
          GitObjectID: "string",
          GitRefname: "string",
          Base64String: "string",
        },
        scalarSchemas: {
          DateTime: "z.string()",
          URI: "z.string()",
          Date: "z.string()",
          GitObjectID: "z.string()",
          GitRefname: "z.string()",
          Base64String: "z.string()",
        },
      },
    },
  },
};

export default config;
