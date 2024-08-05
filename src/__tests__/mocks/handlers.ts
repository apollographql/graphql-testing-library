import { createHandler } from "../../handlers.js";
import typeDefs from "../../../.storybook/stories/components/relay/schema.graphql";
import type { Resolvers } from "../../__generated__/resolvers-types.ts";

export const products = ["beanie", "bottle", "cap", "onesie", "shirt", "socks"];

const { handler, replaceSchema, withResolvers, replaceDelay } =
  createHandler<Resolvers>({
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
    mocks: {
      String: () => "foo bar",
    },
  });

const handlers = [handler];

export { replaceSchema, replaceDelay, handlers, handler, withResolvers };
