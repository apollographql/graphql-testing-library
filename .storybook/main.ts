import type { StorybookConfig } from "@storybook/react-vite";
import relay from "vite-plugin-relay";
import graphqlLoader from "vite-plugin-graphql-loader";

const config: StorybookConfig = {
  stories: ["./**/*.mdx", "./**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-styling-webpack",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, options) {
    // Add your configuration here
    config.plugins?.push(relay, graphqlLoader());
    return config;
  },
};

export default config;
