import type { DocumentNode } from "graphql";
import ecommerceSchema from "../../../.storybook/stories/schemas/ecommerce.graphql";
import type { Resolvers } from "../../__generated__/resolvers-types-ecommerce.ts";
import { createHandler, createWSHandler } from "../../handlers.js";

const typeDefs = `#graphql
  type Query {
    currentNumber: Int
  }

  type Subscription {
    numberIncremented: Int
  }
`;

const products = ["beanie", "bottle", "cap", "onesie", "shirt", "socks"];

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

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

let number = 1;

const subscriptionHandler = createWSHandler({
  typeDefs: typeDefs as unknown as DocumentNode,
  resolvers: {
    Subscription: {
      numberIncremented: {
        async *subscribe() {
          console.log("SUBSCRIBE", number);
          while (number < 50) {
            await wait(1000);
            yield number;
            number++;
          }
        },
        resolve: (value: number) => value,
      },
    },
  },
});

const handlers = [ecommerceHandler, subscriptionHandler];

export { handlers, products, ecommerceHandler, subscriptionHandler };
