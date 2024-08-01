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
} from "../../.storybook/stories/components/apollo-client/ApolloComponent.tsx";
import {
  replaceSchema,
  replaceDelay,
  products,
  withResolvers,
} from "./mocks/handlers.js";

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
      using _restore = withResolvers({
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
      // TODO: investigate flakiness when running with Vite that prompted
      // it to be wrapped in waitFor when it shouldn't need to be
      // await waitFor(() => {
      //   expect(screen.getAllByTestId(/rating/i)[0]).toHaveTextContent("0/5");
      // });
      expect(screen.getByText(/beanie/i)).toBeInTheDocument();
    });
  });
});

// describe.skip("integration tests with github schema", () => {
//   it("renders a component fetching from the GitHub api", async () => {
//     const client = makeClient();

//     const APP_QUERY = gql`
//       query AppQuery {
//         repository(owner: "octocat", name: "Hello-World") {
//           issues(last: 20, states: CLOSED) {
//             edges {
//               node {
//                 title
//                 url
//                 labels(first: 5) {
//                   edges {
//                     node {
//                       name
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     `;

//     const Shell = () => {
//       console.log("render");
//       return (
//         <ApolloProvider client={client}>
//           <Suspense fallback={<h1>Loading...</h1>}>
//             <App />
//           </Suspense>
//         </ApolloProvider>
//       );
//     };

//     const App = () => {
//       const { data } = useSuspenseQuery(APP_QUERY);
//       if (data) {
//         console.log(data.repository.issues.edges);
//       }
//       return <>hi</>;
//     };

//     render(<Shell />);

//     await waitFor(() =>
//       expect(screen.getByText(/beanie/i)).toBeInTheDocument(),
//     );
//   });
// });

describe("unit tests", () => {
  it("can roll back delay via disposable", () => {
    function innerFn() {
      using _restore = replaceDelay(250);
      // @ts-expect-error
      expect(replaceDelay["currentDelay"]).toBe(250);
    }

    innerFn();

    // @ts-expect-error
    expect(replaceDelay["currentDelay"]).toBe(20);
  });
});
