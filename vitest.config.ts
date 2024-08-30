/// <reference types="vitest" />
import { defineConfig } from "vite";
import { vitePluginGraphqlLoader } from "vite-plugin-graphql-loader";

export default defineConfig({
  plugins: [vitePluginGraphqlLoader()],
  test: {
    include: ["**/*.test.tsx"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    server: {
      deps: {
        fallbackCJS: true,
      },
    },
  },
});
