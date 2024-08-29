import { createHandler } from "../../handlers.js";
import typeDefs from "../../../.storybook/stories/ecommerce-schema.graphql";
import type { Resolvers } from "../../__generated__/resolvers-types-ecommerce.ts";

const products = ["beanie", "bottle", "cap", "onesie", "shirt", "socks"];

const graphQLHandler = createHandler<Resolvers>({
  typeDefs,
  resolvers: {
    Query: {
      products: () =>
        Array.from({ length: products.length }, (_element, id) => ({
          id: `${id}`,
          title: products[id],
          mediaUrl: `https://storage.googleapis.com/hack-the-supergraph/apollo-${products[id]}.jpg`,
          reviews: [
            {
              id: `review-${id}`,
              rating: id * 2,
            },
          ],
        })),
    },
  },
});

const handlers = [graphQLHandler];

export { graphQLHandler, handlers, products };
