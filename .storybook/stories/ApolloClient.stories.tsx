import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, waitFor } from "@storybook/test";
import {
  ApolloApp as ApolloEcommerceApp,
  ApolloAppWithDefer as AppWithDefer,
} from "./components/apollo-client/EcommerceExample.js";
import { ApolloApp as ApolloWNBAApp } from "./components/apollo-client/WNBAExample.js";
import { ecommerceHandler } from "../../src/__tests__/mocks/handlers.js";
import { createHandler, createWebSocketHandler } from "../../src/handlers.js";
import wnbaSchema from "../stories/schemas/wnba.graphql";

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const meta = {
  title: "Example/Apollo Client",
  component: ApolloEcommerceApp,
  parameters: {
    layout: "centered",
    msw: {
      handlers: {
        // graphql: ecommerceHandler,
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
    wins: 10,
    losses: 20,
  },
  {
    id: "2",
    name: "Las Vegas Aces",
    wins: 5,
    losses: 6,
  },
  {
    id: "0",
    name: "Las Vegas Aces",
    wins: 5,
    losses: 6,
  },
];

const score = { home: 0, away: 0 };

// WNBAApp.parameters = {
//   msw: {
//     handlers: {
//       // graphql: [
//       //   createHandler({
//       //     typeDefs: wnbaSchema,
//       //     resolvers: {
//       //       Mutation: {
//       //         setCurrentTeam: (_p, { team }) =>
//       //           teams.find((t) => t.id === team),
//       //       },
//       //       Query: {
//       //         team: () => teams[0],
//       //         teams: () => teams,
//       //       },
//       //     },
//       //   }),
//       //   createWebSocketHandler({
//       //     typeDefs: wnbaSchema,
//       //     resolvers: {
//       //       Subscription: {
//       //         score: {
//       //           async *subscribe() {
//       //             while (score.home < 50) {
//       //               const nextBasket = Math.random() < 0.5 ? 2 : 3;
//       //               Math.random() < 0.5
//       //                 ? (score.home += nextBasket)
//       //                 : (score.away += nextBasket);
//       //               await wait(3000);
//       //               yield score;
//       //             }
//       //           },
//       //           resolve: (value: number) => value,
//       //         },
//       //       },
//       //     },
//       //   }),
//       // ],
//     },
//   },
// };
