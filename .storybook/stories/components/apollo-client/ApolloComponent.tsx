import { Suspense } from "react";
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
import { Container } from "../Container.js";
import { Product, Reviews } from "../Product.js";

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

const QUERY: TypedDocumentNode<{
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

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Main />
      </Suspense>
    </ApolloProvider>
  );
}

export function Main() {
  const { data } = useSuspenseQuery(QUERY);

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
