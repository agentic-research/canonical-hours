import type { CodegenConfig } from "@graphql-codegen/cli";

// See canonical-hours.codegen.github.ts's header comment for why this is
// split into two files (types + operations, then the validation-schema
// plugin alone importing from the first) instead of one combined file.
const config: CodegenConfig = {
  schema: "graphql/sources/schema/linear-schema.graphql",
  documents: ["graphql/sources/linear.graphql"],
  generates: {
    "agent/lib/sources/generated/linear-types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        // Must match the schemas file's enumsAsTypes below — see
        // canonical-hours.codegen.github.ts's matching comment.
        enumsAsTypes: false,
        scalars: {
          DateTime: "string",
          TimelessDate: "string",
          JSON: "unknown",
          JSONObject: "unknown",
          DateTimeOrDuration: "string",
          Duration: "string",
          TimelessDateOrDuration: "string",
        },
      },
    },
    "agent/lib/sources/generated/linear.ts": {
      plugins: ["graphql-codegen-typescript-validation-schema"],
      config: {
        schema: "zod",
        withOperationType: true,
        importFrom: "./linear-types",
        enumsAsTypes: false,
        scalars: {
          DateTime: "string",
          TimelessDate: "string",
          JSON: "unknown",
          JSONObject: "unknown",
          DateTimeOrDuration: "string",
          Duration: "string",
          TimelessDateOrDuration: "string",
        },
        scalarSchemas: {
          DateTime: "z.string()",
          TimelessDate: "z.string()",
          JSON: "z.unknown()",
          JSONObject: "z.unknown()",
          DateTimeOrDuration: "z.string()",
          Duration: "z.string()",
          TimelessDateOrDuration: "z.string()",
        },
      },
    },
  },
};

export default config;
