import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, waitFor } from "@storybook/test";
import {
  ApolloApp,
  ApolloAppWithDefer as AppWithDefer,
} from "./components/apollo-client/ApolloComponent.js";
import { handler } from "../../src/__tests__/mocks/handlers.js";

export default {
  title: "Example/Apollo Client",
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

export { AppWithDefer };

export const App: StoryObj<typeof ApolloApp> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: /loading/i }),
    ).toHaveTextContent("Loading...");
    await waitFor(
      () =>
        expect(
          canvas.getByRole("heading", { name: /customers/i }),
        ).toHaveTextContent("Customers also purchased"),
      { timeout: 2000 },
    );
    await waitFor(
      () => expect(canvas.getByText(/beanie/i)).toBeInTheDocument(),
      { timeout: 2000 },
    );
  },
};
