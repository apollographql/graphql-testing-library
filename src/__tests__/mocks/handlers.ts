import ecommerceSchema from "../../../.storybook/stories/schemas/ecommerce.graphql";
import type { Resolvers } from "../../__generated__/resolvers-types-ecommerce.ts";
import { createHandler } from "../../handlers.js";

const products = ["beanie", "bottle", "cap", "onesie", "shirt", "socks"];

const ecommerceHandler = createHandler<Resolvers>({
  typeDefs: ecommerceSchema,
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

const handlers = [ecommerceHandler];

export { handlers, products, ecommerceHandler };
