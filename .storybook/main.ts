import type { StorybookConfig } from "@storybook/react-vite";
import relay from "vite-plugin-relay";

const config: StorybookConfig = {
  stories: ["./**/*.mdx", "./**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
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
    config.plugins?.push(relay);
    return config;
  },
};
export default config;
