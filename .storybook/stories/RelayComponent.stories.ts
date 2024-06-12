import type { Meta, StoryObj } from "@storybook/react";
import RelayComponent from "../../relay-components/RelayComponent";
import { createHandler } from "../../src/handlers";
import { schemaWithMocks } from "../../src/__tests__/mocks/handlers";

const { handler } = createHandler(schemaWithMocks);

const meta = {
  title: "Example/RelayComponent",
  component: RelayComponent,
  parameters: {
    layout: "centered",
    msw: {
      handlers: {
        graphql: handler,
      },
    },
  },
} satisfies Meta<typeof RelayComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
