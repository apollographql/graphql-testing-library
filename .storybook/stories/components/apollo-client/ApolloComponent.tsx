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
} from "@apollo/client";
import { Product, Reviews } from "../Product.js";
import { Container } from "../Container.js";

const httpLink = new HttpLink({
  uri: "https://main--hack-the-e-commerce.apollographos.net/graphql",
});

export const makeClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([httpLink]),
    connectToDevTools: true,
  });

export const client = makeClient();

const APP_QUERY: TypedDocumentNode<{
  products: {
    id: string;
    title: string;
    mediaUrl: string;
    description: string;
    reviews: Array<{ rating: number; id: string; content: string }>;
  }[];
}> = gql`
  query AppQuery {
    products {
      id
      reviews {
        id
        rating
        content
      }
      title
      mediaUrl
      description
    }
  }
`;

const APP_QUERY_WITH_DEFER: TypedDocumentNode<{
  products: {
    id: string;
    title: string;
    mediaUrl: string;
    description: string;
    reviews?: Array<{ rating: number; id: string; content: string }>;
  }[];
}> = gql`
  query AppQuery {
    products {
      id
      ... @defer {
        reviews {
          id
          rating
          content
        }
      }
      title
      mediaUrl
      description
    }
  }
`;

export function Wrapper({ children }: { children: ReactNode }) {
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

export function App() {
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
