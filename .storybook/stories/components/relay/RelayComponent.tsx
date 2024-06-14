import { Suspense, type ReactNode } from "react";
import type { RelayComponentAppQuery } from "./__generated__/RelayComponentAppQuery.graphql.js";
import {
  RelayEnvironmentProvider,
  useFragment,
  useLazyLoadQuery,
} from "react-relay";
import { graphql } from "relay-runtime";
import { Container } from "../Container.js";
import { Product, Reviews as ReviewsContainer } from "../Product.js";
import { RelayEnvironment } from "./relay-environment.js";

export function Wrapper({ children }: { children: ReactNode }) {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>
    </RelayEnvironmentProvider>
  );
}

const ratingsFragment = graphql`
  fragment RelayComponentReviewsFragment_product on Product {
    reviews {
      id
      rating
      content
    }
  }
`;

const appQuery = graphql`
  query RelayComponentAppQuery {
    products {
      id
      ...RelayComponentReviewsFragment_product
      title
      mediaUrl
      description
    }
  }
`;

const appQueryWithDefer = graphql`
  query RelayComponentWithDeferAppQuery {
    products {
      id
      ...RelayComponentReviewsFragment_product @defer
      title
      mediaUrl
      description
    }
  }
`;

export function RelayApp() {
  return (
    <Wrapper>
      <App />
    </Wrapper>
  );
}

export function RelayAppWithDefer() {
  return (
    <Wrapper>
      <AppWithDefer />
    </Wrapper>
  );
}

function App() {
  // Use useLazyLoadQuery here because we want to demo the loading experience
  // with/without defer.
  const data = useLazyLoadQuery<RelayComponentAppQuery>(appQuery, {});

  return (
    <Container>
      {data?.products?.map((product) => (
        <Product key={product.id} product={product}>
          <Suspense fallback="-">
            <Reviews key={product.id} product={product} />
          </Suspense>
        </Product>
      ))}
    </Container>
  );
}

function AppWithDefer() {
  // Use useLazyLoadQuery here because we want to demo the loading experience
  // with/without defer.
  const data = useLazyLoadQuery<RelayComponentAppQuery>(appQueryWithDefer, {});

  return (
    <Container>
      {data?.products?.map((product) => (
        <Product key={product.id} product={product}>
          <Suspense fallback="-">
            <Reviews key={product.id} product={product} />
          </Suspense>
        </Product>
      ))}
    </Container>
  );
}

function Reviews({ product }) {
  const data = useFragment(ratingsFragment, product);

  return <ReviewsContainer reviews={data.reviews} />;
}
