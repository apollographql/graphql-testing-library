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
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, options) {
    config.plugins?.push(relay, graphqlLoader());
    config.css = {
      postcss: {
        plugins: [
          require("tailwindcss")({
            config: ".storybook/tailwind.config.js",
          }),
        ],
      },
    };
    return config;
  },
};

export default config;
