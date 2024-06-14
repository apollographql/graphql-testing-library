import type { Preview } from "@storybook/react";
import { initialize, mswLoader, getWorker } from "msw-storybook-addon";
import "./stories/input.css";

let options = {};

if (location.hostname === "apollographql.github.io") {
  options = {
    serviceWorker: {
      url: "/graphql-testing-library/mockServiceWorker.js",
    },
  };
}

// Initialize MSW
initialize(options);

const preview: Preview = {
  // calling getWorker().start() is a workaround for an issue
  // where Storybook doesn't wait for MSW before running:
  // https://github.com/mswjs/msw-storybook-addon/issues/89
  loaders: [mswLoader, () => getWorker().start()],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
