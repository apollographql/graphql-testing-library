import { ApolloProvider } from "@apollo/client";
import { Suspense } from "react";
import {
  AppWithDefer,
  makeClient,
} from "../../.storybook/stories/components/apollo-client/ApolloComponent.tsx";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import graphqlSchema from "../../.storybook/stories/components/relay/schema.graphql";
import { replaceSchema } from "./mocks/handlers.js";
import { describe, expect, it } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";

describe("integration tests", () => {
  it("runs a test", async () => {
    const client = makeClient();

    render(
      <ApolloProvider client={client}>
        <Suspense fallback={<h1>Loading...</h1>}>
          <AppWithDefer />
        </Suspense>
      </ApolloProvider>
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /loading/i })
      ).toHaveTextContent("Loading...")
    );

    await waitFor(
      () =>
        expect(
          screen.getByRole("heading", { name: /customers/i })
        ).toHaveTextContent("Customers also purchased"),
      { timeout: 2000 }
    );

    await waitFor(() => {
      expect(screen.getByText(/beanie/i)).toBeInTheDocument();
    });
  });
  it("runs a second test", async () => {
    // Make a GraphQL schema with no resolvers
    const schema = makeExecutableSchema({ typeDefs: graphqlSchema });

    // Create a new schema with mocks
    const schemaWithMocks = addMocksToSchema({
      schema,
      resolvers: {
        Query: {
          products: () => {
            return Array.from({ length: 6 }, (_element, id) => ({
              id,
              title: `Foo bar ${id}`,
              reviews: [
                {
                  id: `review-${id}`,
                  rating: id.toFixed(1),
                },
              ],
            }));
          },
        },
      },
    });

    replaceSchema(schemaWithMocks);

    const client = makeClient();

    render(
      <ApolloProvider client={client}>
        <Suspense fallback={<h1>Loading...</h1>}>
          <AppWithDefer />
        </Suspense>
      </ApolloProvider>
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /loading/i })
      ).toHaveTextContent("Loading...")
    );

    await waitFor(
      () =>
        expect(
          screen.getByRole("heading", { name: /customers/i })
        ).toHaveTextContent("Customers also purchased"),
      { timeout: 2000 }
    );

    await waitFor(() => {
      expect(screen.getByText(/foo bar 1/i)).toBeInTheDocument();
    });
    screen.debug();
    await waitFor(() => {
      expect(screen.getByText(/5\/5/i)).toBeInTheDocument();
    });
  });
});
