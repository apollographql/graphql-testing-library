import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, waitFor } from "@storybook/test";
import {
  ApolloApp as ApolloEcommerceApp,
  ApolloAppWithDefer as AppWithDefer,
} from "./components/apollo-client/EcommerceExample.js";
import { ApolloApp as ApolloWNBAApp } from "./components/apollo-client/WNBAExample.js";
import { ecommerceHandler } from "../../src/__tests__/mocks/handlers.js";
import { createHandler } from "../../src/handlers.js";
import wnbaTypeDefs from "../stories/schemas/wnba.graphql";

const meta = {
  title: "Example/Apollo Client",
  component: ApolloEcommerceApp,
  parameters: {
    layout: "centered",
    msw: {
      handlers: {
        graphql: ecommerceHandler,
      },
    },
  },
} satisfies Meta<typeof ApolloEcommerceApp>;

export default meta;

export const EcommerceApp: StoryObj<typeof ApolloEcommerceApp> = {
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

export const EcommerceAppWithDefer = () => <AppWithDefer />;

export const WNBAApp = () => <ApolloWNBAApp />;

const teams = [
  {
    id: "1",
    name: "New York Liberty",
  },
  {
    id: "2",
    name: "Las Vegas Aces",
  },
];

WNBAApp.parameters = {
  msw: {
    handlers: {
      graphql: createHandler({
        typeDefs: wnbaTypeDefs,
        resolvers: {
          Mutation: {
            setCurrentTeam: (_p, { team }) => teams.find((t) => t.id === team),
          },
          Query: {
            team: () => ({
              id: "1",
              name: "New York Liberty",
            }),
            teams: () => teams,
          },
        },
      }),
    },
  },
};
