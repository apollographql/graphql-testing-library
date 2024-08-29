/// <reference types="vitest" />
import { defineConfig } from "vite";
import { vitePluginGraphqlLoader } from "vite-plugin-graphql-loader";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [vitePluginGraphqlLoader(), svgr()],
  test: {
    include: ["**/*.test.tsx"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
  },
});
