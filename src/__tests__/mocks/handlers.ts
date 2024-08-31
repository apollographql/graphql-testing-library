import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createHandler } from "../../handlers.js";
import ecommerceSchema from "../../../.storybook/stories/schemas/ecommerce.graphql";
import wnbaSchema from "../../../demo/server/src/wnba.graphql";

const schema = makeExecutableSchema({ typeDefs: ecommerceSchema });

const products = ["beanie", "bottle", "cap", "onesie", "shirt", "socks"];

// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({
  schema,
  resolvers: {
    Query: {
      products: () =>
        Array.from({ length: products.length }, (_element, id) => ({
          id,
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

const {
  handler: ecommerceHandler,
  replaceSchema,
  replaceDelay,
} = createHandler(schemaWithMocks);

const handlers = [ecommerceHandler];

export {
  replaceSchema,
  replaceDelay,
  handlers,
  ecommerceHandler,
  schemaWithMocks,
};
