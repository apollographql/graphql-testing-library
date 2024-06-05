import React, { Suspense } from "react";
import type { RelayComponentAppQuery } from "./__generated__/RelayComponentAppQuery.graphql";
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
      <Suspense fallback="Loading...">
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
      reviews {
        id
      }
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

  console.log("Rendering Main: ", data);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Customers also purchased
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data?.products?.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={product.mediaUrl}
                  alt={product.description}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </a>
                  </h3>
                </div>
                <Reviews
                  key={product.id}
                  product={product?.reviews?.length ? product : null}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Reviews({ product }) {
  const data = useFragment(ratingsFragment, product);

  return (
    <p className="text-sm font-medium text-gray-900">
      {data?.reviews?.length > 0
        ? `${Math.round(
            data?.reviews
              ?.map((i) => i.rating)
              .reduce((curr, acc) => {
                return curr + acc;
              }) / data.reviews.length
          )}/5`
        : null}
    </p>
  );
}
