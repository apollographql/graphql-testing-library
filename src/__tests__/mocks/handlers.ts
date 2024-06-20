import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createHandler } from "../../handlers.js";
import graphqlSchema from "../../../.storybook/stories/components/relay/schema.graphql";

const typeDefs = `#graphql
  type Query {
    currentNumber: Int
  }

  type Subscription {
    numberIncremented: Int
  }
`;

const schema = makeExecutableSchema({ typeDefs: graphqlSchema });

const wsShema = makeExecutableSchema({ typeDefs });

const products = ["beanie", "bottle", "cap", "onesie", "shirt", "socks"];

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({
  schema,
  resolvers: {
    Query: {
      products: () => {
        console.log("test");
        return Array.from({ length: products.length }, (_element, id) => ({
          id,
          title: products[id],
          mediaUrl: `https://storage.googleapis.com/hack-the-supergraph/apollo-${products[id]}.jpg`,
        }));
      },
    },
  },
});

let number = 1;

const schemaWithWSMocks = addMocksToSchema({
  schema: wsShema,
  resolvers: {
    Subscription: {
      numberIncremented: {
        async *subscribe() {
          while (number < 1000) {
            number += 1;
            await wait(3000);
            yield number;
          }
        },
        resolve: (value: number) => value,
      },
    },
  },
});

const { handler, replaceSchema } = createHandler(schemaWithMocks);

const handlers = [handler];

export { replaceSchema, handlers, schemaWithMocks, schemaWithWSMocks };
