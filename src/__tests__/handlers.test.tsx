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
      </ApolloProvider>
    );

    // The app kicks off the request and we see the initial loading indicator...
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /loading/i })
      ).toHaveTextContent("Loading...")
    );

    // Once the screen unsuspends, we have rendered all data from both the
    // first and second chunk.
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i })
      ).toHaveTextContent("Customers also purchased")
    );

    // The default "real" delay in a Node process is 1ms, so here we expect the
    // two deferred chunks to be batched into a single render.
    expect(screen.getAllByTestId(/rating/i)[0]).not.toHaveTextContent("-");
    expect(screen.getByText(/beanie/i)).toBeInTheDocument();
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
      </ApolloProvider>
    );

    // The app kicks off the request and we see the initial loading indicator...
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /loading/i })
      ).toHaveTextContent("Loading...")
    );

    // Once the screen unsuspends, we have rendered all data from both the
    // first and second chunk.
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i })
      ).toHaveTextContent("Customers also purchased")
    );

    expect(screen.getByText(/foo bar 1/i)).toBeInTheDocument();

    // This "5/5" review value was set when we called `replaceSchema` with a new
    // executable schema in this test.
    expect(screen.getByText(/5\/5/i)).toBeInTheDocument();
  });

  it("can set a new delay via replaceDelay", async () => {
    // In this test we set a new delay value via `replaceDelay` which is used to
    // simulate network latency.
    // Usually, in Jest tests we want this to be 1ms (the default in Node
    // processes) but in certain tests we may want to validate that e.g.
    // a multipart response activates Suspense boundaries.

    // Also, by creating a disposable via `using`, the delay gets
    // automatically restored to its previous value at the end of the test.
    using _restore = replaceDelay(500);

    const client = makeClient();

    render(
      <ApolloProvider client={client}>
        <Suspense fallback={<h1>Loading...</h1>}>
          <AppWithDefer />
        </Suspense>
      </ApolloProvider>
    );

    // The app kicks off the request and we see the initial loading indicator...
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /loading/i })
      ).toHaveTextContent("Loading...")
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i })
      ).toHaveTextContent("Customers also purchased")
    );

    // Since our renders are no longer batched due to the 500ms delay, we will
    // now see a loading state for the reviews, indicated by a "-" placeholder.
    expect(screen.getAllByTestId(/rating/i)[0]).toHaveTextContent("-");
    expect(screen.getByText(/beanie/i)).toBeInTheDocument();

    // And one final render once the second chunk resolves after the delay and
    // the reviews can be displayed. Note that the original schema has been
    // restored.
    await waitFor(() => {
      expect(screen.getByText(/10\/5/i)).toBeInTheDocument();
    });
  });
});
