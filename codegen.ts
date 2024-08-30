import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
  generates: {
    "./src/__generated__/resolvers-types-ecommerce.ts": {
      schema: "./.storybook/stories/ecommerce-schema.graphql",
      plugins: ["typescript", "typescript-resolvers"],
    },
    "./src/__generated__/resolvers-types-github.ts": {
      schema: "./.storybook/stories/github-schema.graphql",
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
