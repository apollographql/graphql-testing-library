import { Suspense } from "react";
import {
  ApolloProvider,
  gql,
  useSuspenseQuery,
  type TypedDocumentNode,
} from "@apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import {
  App,
  AppWithDefer,
  makeClient,
} from "../../.storybook/stories/components/apollo-client/EcommerceExample.tsx";
import { ecommerceHandler, products } from "./mocks/handlers.js";
import { createSchemaWithDefaultMocks } from "../handlers.ts";
import githubTypeDefs from "../../.storybook/stories/schemas/github.graphql";
import type { Resolvers } from "../__generated__/resolvers-types-github.ts";

describe("integration tests", () => {
  describe("single execution result response", () => {
    it("intercepts and resolves with a single payload", async () => {
      const client = makeClient();

      render(
        <ApolloProvider client={client}>
          <Suspense fallback={<h1>Loading...</h1>}>
            <App />
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

      expect(screen.getByText(/beanie/i)).toBeInTheDocument();
      expect(screen.getAllByTestId(/rating/i)[0]).not.toHaveTextContent("-");
    });
  });
  describe("multipart response", () => {
    it("uses the initial mock schema set in the handler by default", async () => {
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

      // The default "real" delay in a Node process is 20ms to avoid render
      // batching
      // Once the screen unsuspends, we have rendered the first chunk
      expect(screen.getAllByTestId(/rating/i)[0]).toHaveTextContent("-");
      expect(screen.getByText(/beanie/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getAllByTestId(/rating/i)[0]).not.toHaveTextContent("-");
      });
    });
    it("can set a new schema via replaceSchema", async () => {
      using _restore = ecommerceHandler.withResolvers({
        Query: {
          products: () => {
            return Array.from({ length: 6 }, (_element, id) => ({
              id: `${id}`,
              title: `Foo bar ${id}`,
              mediaUrl: `https://storage.googleapis.com/hack-the-supergraph/apollo-${products[id]}.jpg`,
              reviews: [
                {
                  id: `review-${id}`,
                  rating: id,
                },
              ],
            }));
          },
        },
      });

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

      // The default "real" delay in a Node process is 20ms to avoid batching
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
      // Usually, in Jest tests we want this to be 20ms (the default in Node
      // processes) so renders are *not* auto-batched, but in certain tests we may
      // want a shorter or longer delay before chunks or entire responses resolve
      using _restore = ecommerceHandler.replaceDelay(1);

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
      // TODO: investigate flakiness when running with Vite that prompted
      // it to be wrapped in waitFor when it shouldn't need to be
      // await waitFor(() => {
      //   expect(screen.getAllByTestId(/rating/i)[0]).toHaveTextContent("0/5");
      // });
      expect(screen.getByText(/beanie/i)).toBeInTheDocument();
    });
  });
});

describe("integration tests with github schema", () => {
  it("renders a component fetching from the GitHub api", async () => {
    const client = makeClient();

    const schemaWithMocks = createSchemaWithDefaultMocks<Resolvers>(
      githubTypeDefs,
      {
        IssueConnection: {
          // @ts-expect-error TODO: improve types to accept a deep partial of
          // whatever the resolver type returns here
          edges: (_parent, _args, _context, info) => {
            return Array(parseInt(info.variableValues.last as string))
              .fill(null)
              .map((_item, idx) => ({
                cursor: "2",
                node: {
                  title: `Some issue ${idx}`,
                  url: `https://github.com/foo-bar/issues/${idx}`,
                  id: `${idx}`,
                },
              }));
          },
        },
      },
    );

    using _restore = ecommerceHandler.replaceSchema(schemaWithMocks);

    const APP_QUERY: TypedDocumentNode<{
      repository: {
        issues: {
          edges: {
            node: {
              id: string;
              title: string;
              url: string;
              author: { login: string };
            };
          }[];
        };
      };
    }> = gql`
      query AppQuery($owner: String, $name: String, $last: String) {
        repository(owner: $owner, name: $name) {
          issues(last: $last, states: CLOSED) {
            edges {
              node {
                id
                title
                url
                author {
                  login
                }
              }
            }
          }
        }
      }
    `;

    const Shell = () => {
      return (
        <ApolloProvider client={client}>
          <Suspense fallback={<h1>Loading...</h1>}>
            <App />
          </Suspense>
        </ApolloProvider>
      );
    };

    const App = () => {
      const { data } = useSuspenseQuery(APP_QUERY, {
        variables: { owner: "octocat", name: "Hello World", last: "5" },
      });

      if (!data) return null;

      return (
        <ul>
          {data.repository.issues.edges.map((item) => (
            <li key={item.node.id}>{item.node.url}</li>
          ))}
        </ul>
      );
    };

    render(<Shell />);

    await waitFor(() =>
      expect(
        screen.getByText("https://github.com/foo-bar/issues/0"),
      ).toBeInTheDocument(),
    );

    [1, 2, 3, 4].forEach((num) => {
      expect(
        screen.getByText(`https://github.com/foo-bar/issues/${num}`),
      ).toBeInTheDocument();
    });
  });
});

describe("unit tests", () => {
  it("can roll back delay via disposable", () => {
    function innerFn() {
      using _restore = ecommerceHandler.replaceDelay(250);
      // @ts-expect-error intentionally accessing a property that has been
      // excluded from the type
      expect(ecommerceHandler.replaceDelay["currentDelay"]).toBe(250);
    }

    innerFn();

    // @ts-expect-error intentionally accessing a property that has been
    // excluded from the type
    expect(ecommerceHandler.replaceDelay["currentDelay"]).toBe(20);
  });
});
