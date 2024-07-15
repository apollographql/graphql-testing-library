import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createHandler } from "../../handlers.js";
import graphqlSchema from "../../../.storybook/stories/components/relay/schema.graphql";

const schema = makeExecutableSchema({ typeDefs: graphqlSchema });

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
              rating: id.toFixed(1),
            },
          ],
        })),
    },
  },
});

const { handler, replaceSchema } = createHandler(schemaWithMocks);

const handlers = [handler];

export { replaceSchema, handlers, schemaWithMocks };
