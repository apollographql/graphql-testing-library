import { ApolloProvider } from "@apollo/client";
import { Suspense } from "react";
import {
  AppWithDefer,
  makeClient,
} from "../../.storybook/stories/components/apollo-client/ApolloComponent.tsx";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import graphqlSchema from "../../.storybook/stories/components/relay/schema.graphql";
import { replaceSchema, replaceDelay } from "./mocks/handlers.js";
import { describe, expect, it } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";

describe("integration tests", () => {
  it("uses the initial mock schema set in the handler passed to setupServer by default", async () => {
    const client = makeClient();

    render(
      <ApolloProvider client={client}>
        <Suspense fallback={<h1>Loading...</h1>}>
          <AppWithDefer />
        </Suspense>
      </ApolloProvider>,
    );

    // The app kicks off the request and we see the initial loading indicator...
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /loading/i }),
      ).toHaveTextContent("Loading..."),
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i }),
      ).toHaveTextContent("Customers also purchased"),
    );

    // The default "real" delay in a Node process is 15ms to avoid render
    // batching
    // Once the screen unsuspends, we have rendered the first chunk
    expect(screen.getAllByTestId(/rating/i)[0]).toHaveTextContent("-");
    expect(screen.getByText(/beanie/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByTestId(/rating/i)[0]).not.toHaveTextContent("-");
    });
  });
  it("can set a new schema via replaceSchema", async () => {
    // Create an executable GraphQL schema with no resolvers
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
                  rating: id,
                },
              ],
            }));
          },
        },
      },
    });

    using _restore = replaceSchema(schemaWithMocks);

    const client = makeClient();

    render(
      <ApolloProvider client={client}>
        <Suspense fallback={<h1>Loading...</h1>}>
          <AppWithDefer />
        </Suspense>
      </ApolloProvider>,
    );

    // The app kicks off the request and we see the initial loading indicator...
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /loading/i }),
      ).toHaveTextContent("Loading..."),
    );

    // The default "real" delay in a Node process is 15ms to avoid batching
    // Once the screen unsuspends, we have rendered the first chunk
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i }),
      ).toHaveTextContent("Customers also purchased"),
    );

    expect(screen.getAllByTestId(/rating/i)[0]).toHaveTextContent("-");
    expect(screen.getByText(/foo bar 1/i)).toBeInTheDocument();

    await waitFor(() => {
      // This "5/5" review value was set when we called `replaceSchema` with a
      // new executable schema in this test
      expect(screen.getByText(/5\/5/i)).toBeInTheDocument();
    });
  });
  it("can set a new delay via replaceDelay", async () => {
    // In this test we set a new delay value via `replaceDelay` which is used to
    // simulate network latency
    // Usually, in Jest tests we want this to be 15ms (the default in Node
    // processes) so renders are *not* auto-batched, but in certain tests we may
    // want a shorter or longer delay before chunks or entire responses resolve
    using _restore = replaceDelay(1);

    const client = makeClient();

    render(
      <ApolloProvider client={client}>
        <Suspense fallback={<h1>Loading...</h1>}>
          <AppWithDefer />
        </Suspense>
      </ApolloProvider>,
    );

    // The app kicks off the request and we see the initial loading indicator...
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /loading/i }),
      ).toHaveTextContent("Loading..."),
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i }),
      ).toHaveTextContent("Customers also purchased"),
    );

    // Since our renders are batched, we will see the final review value
    // in the initial render, since renders have been batched
    expect(screen.getAllByTestId(/rating/i)[0]).toHaveTextContent("0/5");
    expect(screen.getByText(/beanie/i)).toBeInTheDocument();
  });
  it("can roll back delay via disposable", () => {
    function innerFn() {
      using _restore = replaceDelay(250);
      // @ts-expect-error
      expect(replaceDelay["currentDelay"]).toBe(250);
    }

    innerFn();

    // @ts-expect-error
    expect(replaceDelay["currentDelay"]).toBe(15);
  });
});
