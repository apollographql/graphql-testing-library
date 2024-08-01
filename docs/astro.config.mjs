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
          autogenerate: { directory: "getting-started" },
        },
        // {
        //   label: "Examples",
        //   autogenerate: { directory: "examples" },
        // },
        // {
        //   label: "Guides",
        //   items: [
        //     // Each item here is one entry in the navigation menu.
        //     { label: "Example Guide", slug: "guides/example" },
        //   ],
        // },
      ],
    }),
  ],
});
