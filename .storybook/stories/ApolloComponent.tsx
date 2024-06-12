import { Suspense } from "react";
import type { TypedDocumentNode } from "@apollo/client";
import {
  gql,
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  Observable,
  HttpLink,
  useSuspenseQuery,
} from "@apollo/client";

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
    reviews: Array<{ rating: number }>;
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
                <p className="text-sm font-medium text-gray-900">
                  {product?.reviews?.length > 0
                    ? `${Math.round(
                        product?.reviews
                          ?.map((i) => i.rating)
                          .reduce((curr, acc) => {
                            return curr + acc;
                          }) / product.reviews.length
                      )}/5`
                    : "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
