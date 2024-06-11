import type { Meta, StoryObj } from "@storybook/react";
import RelayComponent from "../../relay-components/RelayComponent";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { within, userEvent, expect } from "@storybook/test";
import { fn } from "@storybook/test";
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
  title: "Example/RelayComponent",
  component: RelayComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
    msw: {
      handlers: {
        graphql: handler,
      },
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: "color" },
  // },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof RelayComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  // args: {
  //   primary: true,
  //   label: "Button",
  // },
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   const loginButton = canvas.getByRole("button", { name: /Log in/i });
  //   await expect(loginButton).toBeInTheDocument();
  //   await userEvent.click(loginButton);
  //   await expect(loginButton).not.toBeInTheDocument();
  //   const logoutButton = canvas.getByRole("button", { name: /Log out/i });
  //   await expect(logoutButton).toBeInTheDocument();
  // },
};
