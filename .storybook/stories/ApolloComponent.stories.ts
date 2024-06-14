import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, waitFor } from "@storybook/test";
import {
  ApolloApp,
  ApolloAppWithDefer,
} from "./components/apollo-client/ApolloComponent.js";
import { createHandler } from "../../src/handlers";
import { schemaWithMocks } from "../../src/__tests__/mocks/handlers";
import { Canvas } from "@storybook/blocks";

const { handler } = createHandler(schemaWithMocks);

const meta = {
  title: "Example/ApolloComponent",
  component: ApolloApp,
  parameters: {
    layout: "centered",
    msw: {
      handlers: {
        graphql: handler,
      },
    },
  },
} satisfies Meta<typeof ApolloApp>;

export default meta;

export { ApolloAppWithDefer };

type Story = StoryObj<typeof meta>;

export const ApolloAppWithoutDefer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: /loading/i })
    ).toHaveTextContent("Loading...");
    await waitFor(
      () =>
        expect(
          canvas.getByRole("heading", { name: /customers/i })
        ).toHaveTextContent("Customers also purchased"),
      { timeout: 2000 }
    );
    await waitFor(
      () => expect(canvas.getByText(/beanie/i)).toBeInTheDocument(),
      { timeout: 2000 }
    );
  },
};
