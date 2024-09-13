import ecommerceSchema from "../../../.storybook/stories/schemas/ecommerce.graphql";
import type { Resolvers } from "../../__generated__/resolvers-types-ecommerce.ts";
import { createHandler } from "../../handlers.js";

const products = [
  {
    title: "Angel Reese jersey",
    image:
      "https://images.footballfanatics.com/chicago-sky/unisex-gameday-greats-angel-reese-black-chicago-sky-lightweight-replica-basketball-jersey_ss5_p-201677223+u-fbnczhnvbnqfxanxi1ae+v-rk4qbobzheharxlpg57s.jpg?_hv=2&w=340",
  },
  {
    title: "Caitlin Clark jersey",
    image:
      "https://images.footballfanatics.com/indiana-fever/unisex-nike-caitlin-clark-red-indiana-fever-2024-wnba-draft-rebel-edition-victory-player-jersey_ss5_p-201407181+u-abfqbqo4peayozcdzhsf+v-zthksnphweto6ukwoobd.jpg?_hv=2&w=340",
  },
  {
    title: "A'ja Wilson jersey",
    image:
      "https://images.footballfanatics.com/las-vegas-aces/unisex-nike-aja-wilson-black-las-vegas-aces-explorer-edition-player-jersey_ss5_p-200590443+u-uwugov9rsqgho4cey2eg+v-wstkwdw4vxqfqvfpjgdg.jpg?_hv=2&w=340",
  },
  {
    title: "Sabrina Ionescu jersey",
    image:
      "https://images.footballfanatics.com/new-york-liberty/youth-nike-sabrina-ionescu-mint-new-york-liberty-2023-rebel-edition-victory-player-jersey_ss5_p-5357567+u-4qpugyfcduxdrcitx17c+v-0cygo4guuapzeat1ll15.jpg?_hv=2&w=340",
  },
  {
    title: "Arike Ogunbowale jersey",
    image:
      "https://images.footballfanatics.com/dallas-wings/unisex-nike-arike-ogunbowale-black-dallas-wings-rebel-edition-victory-player-jersey_pi4479000_ff_4479981-ac8e11c6707f6ec68f13_full.jpg?_hv=2&w=340",
  },
  {
    title: "Cameron Brink jersey",
    image:
      "https://images.footballfanatics.com/los-angeles-sparks/unisex-gameday-greats-cameron-brink-purple-los-angeles-sparks-lightweight-replica-basketball-jersey_ss5_p-201677217+u-jgbyg0kj8s1hezmtl4dy+v-g7cwsy49ipo2sqjrdzfp.jpg?_hv=2&w=340",
  },
];

const handler = createHandler<Resolvers>({
  typeDefs: ecommerceSchema,
  resolvers: {
    Query: {
      products: () =>
        products.map((_element, index) => ({
          id: `${index}`,
          title: products[index]?.title,
          mediaUrl: products[index]?.image,
        })),
    },
  },
  delay: 500,
  mocks: {
    Float: () => 5.0,
  },
});

const handlers = [handler];

export { handlers, products, handler as ecommerceHandler };
