import type { Meta, StoryObj } from "@storybook/react";
import ApolloComponent from "./ApolloComponent";
import { createHandler } from "../../src/handlers";
import { schemaWithMocks } from "../../src/__tests__/mocks/handlers";

const { handler } = createHandler(schemaWithMocks);

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

export const Primary: Story = {};
