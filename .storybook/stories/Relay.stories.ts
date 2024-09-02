import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, waitFor } from "@storybook/test";
import {
  RelayApp,
  RelayAppWithDefer as AppWithDefer,
} from "./components/relay/RelayComponent.js";
import { ecommerceHandler } from "../../src/__tests__/mocks/handlers.js";

export default {
  title: "Example/Relay",
  component: RelayApp,
  parameters: {
    layout: "centered",
    msw: {
      handlers: {
        graphql: ecommerceHandler,
      },
    },
  },
} satisfies Meta<typeof RelayApp>;

export { AppWithDefer };

export const App: StoryObj<typeof RelayApp> = {
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
