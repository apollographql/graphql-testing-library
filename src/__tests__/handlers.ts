import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import graphqlSchema from "../../relay-components/schema.graphql";
import { createHandler } from "../handlers.js";

// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({ typeDefs: graphqlSchema });

const products = ["beanie", "bottle", "cap", "onesie", "shirt", "socks"];

// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({
  schema,
  resolvers: {
    Query: {
      products: () => {
        return Array.from({ length: 6 }, (_element, id) => ({
          id,
          title: products[id],
          mediaUrl: `https://storage.googleapis.com/hack-the-supergraph/apollo-${products[id]}.jpg`,
        }));
      },
    },
  },
});

const { handler, replaceSchema } = createHandler(schemaWithMocks);

const handlers = [handler];

export { replaceSchema, handlers };
