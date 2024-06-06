import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, waitFor } from "@storybook/test";
import {
  ApolloApp,
  ApolloAppWithDefer as AppWithDefer,
} from "./components/apollo-client/ApolloComponent.js";
import { createHandler } from "../../src/handlers.js";
import { schemaWithMocks } from "../../src/__tests__/mocks/handlers.js";

const { handler } = createHandler(schemaWithMocks);

const meta = {
  title: "Example/Apollo",
  component: ApolloApp,
  // tags: ["autodocs"],
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

export { AppWithDefer };

type Story = StoryObj<typeof meta>;

export const App: Story = {
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
