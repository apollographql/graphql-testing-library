import type { StorybookConfig } from "@storybook/react-vite";
import relay from "vite-plugin-relay";
import graphqlLoader from "vite-plugin-graphql-loader";

const config: StorybookConfig = {
  stories: ["./**/*.mdx", "./**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  staticDirs: ["./public"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-styling-webpack",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      strictMode: false,
    },
  },
  async viteFinal(config, options) {
    // Add your configuration here
    config.plugins?.push(relay, graphqlLoader());
    return config;
  },
};

export default config;
