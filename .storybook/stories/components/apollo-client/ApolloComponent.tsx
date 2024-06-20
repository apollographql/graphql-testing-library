import { Suspense, type ReactNode } from "react";
import type { TypedDocumentNode } from "@apollo/client";
import {
  gql,
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  HttpLink,
  useSuspenseQuery,
  split,
  useSubscription,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { Product, Reviews } from "../Product.js";
import { Container } from "../Container.js";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  })
);

const httpLink = new HttpLink({
  uri: "https://main--hack-the-e-commerce.apollographos.net/graphql",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const makeClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
    connectToDevTools: true,
  });

export const client = makeClient();

const APP_QUERY: TypedDocumentNode<{
  products: {
    id: string;
    title: string;
    mediaUrl: string;
    reviews: Array<{ rating: number; id: string }>;
  }[];
}> = gql`
  query AppQuery {
    products {
      id
      reviews {
        id
        rating
      }
      title
      mediaUrl
    }
  }
`;

const APP_QUERY_WITH_DEFER: TypedDocumentNode<{
  products: {
    id: string;
    title: string;
    mediaUrl: string;
    reviews?: Array<{ rating: number; id: string }>;
  }[];
}> = gql`
  query AppQueryWithDefer {
    products {
      id
      ... @defer {
        reviews {
          id
          rating
        }
      }
      title
      mediaUrl
    }
  }
`;

const APP_SUBSCRIPTION: TypedDocumentNode<{
  numberIncremented: number;
}> = gql`
  subscription AppSubscription {
    numberIncremented
  }
`;

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>
    </ApolloProvider>
  );
}

export function ApolloApp() {
  return (
    <Wrapper>
      <App />
    </Wrapper>
  );
}

export function ApolloAppWithDefer() {
  return (
    <Wrapper>
      <AppWithDefer />
    </Wrapper>
  );
}

export function ApolloAppSubscription() {
  return (
    <Wrapper>
      <AppWithWSSubscription />
    </Wrapper>
  );
}

export function App() {
  // Use useSuspenseQuery here because we want to demo the loading experience
  // with/without defer.
  const { data } = useSuspenseQuery(APP_QUERY);

  return (
    <Container>
      {data.products.map((product) => (
        <Product key={product.id} product={product}>
          <Reviews reviews={product.reviews} />
        </Product>
      ))}
    </Container>
  );
}

export function AppWithDefer() {
  // Use useSuspenseQuery here because we want to demo the loading experience
  // with/without defer.
  const { data } = useSuspenseQuery(APP_QUERY_WITH_DEFER);

  return (
    <Container>
      {data.products.map((product) => (
        <Product key={product.id} product={product}>
          <Reviews reviews={product.reviews || []} />
        </Product>
      ))}
    </Container>
  );
}

export function AppWithWSSubscription() {
  const { data } = useSubscription(APP_SUBSCRIPTION);

  return <>{data?.numberIncremented}</>;
}
