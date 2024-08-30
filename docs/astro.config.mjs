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
            { label: "Usage in Node.js", slug: "integrations/node" },
            { label: "Usage in the browser", slug: "integrations/browser" },
          ],
        },
        {
          label: "Storybook",
          link: "https://apollographql.github.io/graphql-testing-library",
        },
      ],
    }),
  ],
});
