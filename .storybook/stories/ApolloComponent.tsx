import React, { Suspense } from "react";

import type { TypedDocumentNode } from "@apollo/client";

import {
  useQuery,
  gql,
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  Observable,
  HttpLink,
  useSuspenseQuery,
} from "@apollo/client";

const delayLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const handle = setTimeout(() => {
      forward(operation).subscribe(observer);
    }, 1000);

    return () => clearTimeout(handle);
  });
});

const httpLink = new HttpLink({
  uri: "https://main--hack-the-e-commerce.apollographos.net/graphql",
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([delayLink, httpLink]),
});

const QUERY: TypedDocumentNode<{
  products: {
    id: string;
    title: string;
    mediaUrl: string;
    description: string;
    price: {
      amount: number;
      currency: string;
    };
  }[];
}> = gql`
  query AppQuery {
    products {
      price {
        amount
        currency
      }
      id
      title
      mediaUrl
      description
    }
  }
`;

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Suspense fallback="Loading...">
        <Main />
      </Suspense>
    </ApolloProvider>
  );
}

function Main() {
  const { data } = useSuspenseQuery(QUERY);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Customers also purchased
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={product.mediaUrl}
                  // alt={product.imageAlt}
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
                  {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                </div>
                {/* <p className="text-sm font-medium text-gray-900">
                  {product.price.amount}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
