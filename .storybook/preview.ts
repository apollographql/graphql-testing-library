import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
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
  loaders: [mswLoader],
};

export default preview;
