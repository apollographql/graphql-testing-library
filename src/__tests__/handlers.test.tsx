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
    console.time("handler");
    const client = makeClient();

    const products = ["beanie", "bottle", "cap", "onesie", "shirt", "socks"];
    const schema = makeExecutableSchema({ typeDefs: graphqlSchema });

    const schemaWithMocks = addMocksToSchema({
      schema,
      resolvers: {
        Query: {
          products: () =>
            Array.from({ length: products.length }, (_element, id) => ({
              id,
              title: products[id],
              mediaUrl: `https://storage.googleapis.com/hack-the-supergraph/apollo-${products[id]}.jpg`,
            })),
        },
      },
    });

    replaceSchema(schemaWithMocks);

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

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i })
      ).toHaveTextContent("Customers also purchased")
    );

    await waitFor(() => {
      expect(screen.getByText(/beanie/i)).toBeInTheDocument();
    });
    console.timeEnd("handler");
  });
  it("runs a second test", async () => {
    console.time("handler");
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
                  rating: parseFloat(`${id}.2`),
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

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i })
      ).toHaveTextContent("Customers also purchased")
    );

    await waitFor(() => {
      expect(screen.getByText(/foo bar 1/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/5\/5/i)).toBeInTheDocument();
    });
    console.timeEnd("handler");
  });
  it("runs a third test", async () => {
    console.time("handler");
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
                  rating: parseFloat(`${id}.2`),
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

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i })
      ).toHaveTextContent("Customers also purchased")
    );

    await waitFor(() => {
      expect(screen.getByText(/foo bar 1/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/5\/5/i)).toBeInTheDocument();
    });
    console.timeEnd("handler");
  });
  it("runs a fourth test", async () => {
    console.time("handler");
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
                  rating: parseFloat(`${id}.2`),
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

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i })
      ).toHaveTextContent("Customers also purchased")
    );

    await waitFor(() => {
      expect(screen.getByText(/foo bar 1/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/5\/5/i)).toBeInTheDocument();
    });
    console.timeEnd("handler");
  });
  it("runs a fifth test", async () => {
    console.time("handler");
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
                  rating: parseFloat(`${id}.2`),
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

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /customers/i })
      ).toHaveTextContent("Customers also purchased")
    );

    await waitFor(() => {
      expect(screen.getByText(/foo bar 1/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/5\/5/i)).toBeInTheDocument();
    });
    console.timeEnd("handler");
  });
});
