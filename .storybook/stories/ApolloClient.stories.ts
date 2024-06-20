import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, waitFor } from "@storybook/test";
import {
  ApolloApp,
  ApolloAppWithDefer as AppWithDefer,
  ApolloAppSubscription,
} from "./components/apollo-client/ApolloComponent.js";
import { createHandler, createWSHandler } from "../../src/handlers.js";
import {
  schemaWithMocks,
  schemaWithWSMocks,
} from "../../src/__tests__/mocks/handlers.js";

const { handler } = createHandler(schemaWithMocks);
const { wsHandler } = createWSHandler(schemaWithWSMocks);

const meta = {
  title: "Example/Apollo Client",
  component: ApolloApp,
  parameters: {
    layout: "centered",
    msw: {
      handlers: {
        // graphql: [handler, wsHandler],
        graphql: [wsHandler],
      },
    },
  },
} satisfies Meta<typeof ApolloApp>;

export default meta;

export { AppWithDefer, ApolloAppSubscription };

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
