import { Suspense } from "react";
import type { RelayComponentAppQuery } from "./__generated__/RelayComponentAppQuery.graphql.js";
import {
  RelayEnvironmentProvider,
  loadQuery,
  useFragment,
  usePreloadedQuery,
} from "react-relay";
import { serializeFetchParameter } from "@apollo/client";
import type { CacheConfig, RequestParameters } from "relay-runtime";
import {
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
  graphql,
  QueryResponseCache,
} from "relay-runtime";
import type { Variables } from "relay-runtime";

import { maybe } from "@apollo/client/utilities";
import {
  handleError,
  readMultipartBody,
} from "@apollo/client/link/http/parseAndCheckHttpResponse";
import { Container } from "../Container.js";
import { Product, Reviews as ReviewsContainer } from "../Product.js";

const uri = "https://main--hack-the-e-commerce.apollographos.net/graphql";

const oneMinute = 60 * 1000;
const cache = new QueryResponseCache({ size: 250, ttl: oneMinute });

const backupFetch = maybe(() => fetch);

function fetchQuery(
  operation: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig
) {
  const queryID = operation.text;
  const isMutation = operation.operationKind === "mutation";
  const isQuery = operation.operationKind === "query";
  const forceFetch = cacheConfig && cacheConfig.force;

  // Try to get data from cache on queries
  const fromCache = cache.get(queryID, variables);
  if (isQuery && fromCache !== null && !forceFetch) {
    return fromCache;
  }

  const body = {
    operationName: operation.name,
    variables,
    query: operation.text || "",
  };

  const options: {
    method: string;
    headers: Record<string, any>;
    body?: string;
  } = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "multipart/mixed;deferSpec=20220824,application/json",
    },
  };

  return Observable.create((sink) => {
    try {
      options.body = serializeFetchParameter(body, "Payload");
    } catch (parseError) {
      sink.error(parseError as Error);
    }

    const currentFetch = maybe(() => fetch) || backupFetch;

    const observerNext = (data) => {
      if ("incremental" in data) {
        for (const item of data.incremental) {
          sink.next(item);
        }
      } else if ("data" in data) {
        sink.next(data);
      }
    };

    currentFetch!(uri, options)
      .then(async (response) => {
        const ctype = response.headers?.get("content-type");

        if (ctype !== null && /^multipart\/mixed/i.test(ctype)) {
          return readMultipartBody(response, observerNext);
        } else {
          const json = await response.json();

          if (isQuery && json) {
            cache.set(queryID, variables, json);
          }
          // Clear cache on mutations
          if (isMutation) {
            cache.clear();
          }

          observerNext(json);
        }
      })
      .then(() => {
        sink.complete();
      })
      .catch((err: any) => {
        handleError(err, sink);
      });
  });
}

const network = Network.create(fetchQuery);

export const RelayEnvironment = new Environment({
  network,
  store: new Store(new RecordSource()),
});

export default function App() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Main />
      </Suspense>
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
      ...RelayComponentReviewsFragment_product @defer
      title
      mediaUrl
      description
    }
  }
`;

const queryReference = loadQuery<RelayComponentAppQuery>(
  RelayEnvironment,
  appQuery,
  {}
);

function Main() {
  const data = usePreloadedQuery<RelayComponentAppQuery>(
    appQuery,
    queryReference
  );

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
