import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "GraphQL Testing Library",
      social: {
        github: "https://github.com/apollographql/graphql-testing-library",
        discord: "https://discord.gg/graphos",
      },
      sidebar: [
        {
          label: "Getting started",
          items: [
            { label: "Installation", slug: "installation" },
            { label: "In Node.js", slug: "integrations/node" },
            { label: "In the browser", slug: "integrations/browser" },
          ],
        },
        {
          label: "Guides",
          items: [{ label: "Creating a handler", slug: "creating-a-handler" }],
        },
        {
          label: "Storybook Examples",
          link: "https://apollographql.github.io/graphql-testing-library",
        },
      ],
    }),
  ],
});
