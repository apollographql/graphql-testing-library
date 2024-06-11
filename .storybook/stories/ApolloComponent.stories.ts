import type { Meta, StoryObj } from "@storybook/react";
// import { createTestSchema } from "@apollo/client/testing/experimental";
import ApolloComponent from "./ApolloComponent";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { within, userEvent, expect, waitFor } from "@storybook/test";
import { createHandler } from "../../src/handlers";
import schemaString from "../../relay-components/schema.graphql";

// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({ typeDefs: schemaString });

const products = ["beanie", "bottle", "cap", "onesie", "shirt", "socks"];

// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({
  schema,
  resolvers: {
    Query: {
      products: () => {
        return Array.from({ length: 6 }, (_element, id) => ({
          id,
          title: products[id].charAt(0).toUpperCase() + products[id].slice(1),
          mediaUrl: `https://storage.googleapis.com/hack-the-supergraph/apollo-${products[id]}.jpg`,
        }));
      },
    },
  },
});

const handler = createHandler(schemaWithMocks);

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/ApolloComponent",
  component: ApolloComponent,
  parameters: {
    layout: "centered",
    msw: {
      handlers: {
        graphql: handler,
      },
    },
  },
} satisfies Meta<typeof ApolloComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const user = {};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   await expect(
  //     canvas.getByRole("heading", { name: /loading/i })
  //   ).toHaveTextContent("Loading...");
  //   await waitFor(
  //     () =>
  //       expect(
  //         canvas.getByRole("heading", { name: /customers/i })
  //       ).toHaveTextContent("Customers also purchased"),
  //     { timeout: 2000 }
  //   );
  //   await waitFor(
  //     () => expect(canvas.getByText(/beanie/i)).toBeInTheDocument(),
  //     { timeout: 2000 }
  //   );
  // },
};
