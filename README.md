<div align="center">
  <h1>GraphQL Testing Library</h1>

  <!-- <a href="https://www.apollographql.com/"><img src="https://raw.githubusercontent.com/apollographql/apollo-client-devtools/main/assets/apollo-wordmark.svg" height="100" alt="Apollo Client"></a> -->

  <p>Testing utilities that encourage good practices for apps built with GraphQL.</p>

</div>
<hr />

**GraphQL Testing Library** provides utilities that make it easy to generate [Mock Service Worker](https://mswjs.io/) handlers for any GraphQL API.

MSW is the [Testing Library-recommended](https://testing-library.com/docs/react-testing-library/example-intro/#full-example) way to declaratively mock API communication in your tests without stubbing `window.fetch`.

This library currently supports incremental delivery features `@defer` and `@stream` out of the box, with plans to support subscriptions over multipart HTTP as well as other transports such as WebSockets, [currently in beta in MSW](https://github.com/mswjs/msw/discussions/2010).

> This project is not affiliated with the ["Testing Library"](https://github.com/testing-library) ecosystem that inspired it. We're just fans :)


## Installation

This library has `peerDependencies` listings for `msw` at `^2.0.0` and `graphql` at `^15.0.0 || ^16.0.0`. Install them along with this library using your preferred package manager:

```
npm install --save-dev @apollo/graphql-testing-library msw graphql
pnpm add --save-dev @apollo/graphql-testing-library msw graphql
yarn add --dev @apollo/graphql-testing-library msw graphql
bun add --dev @apollo/graphql-testing-library msw graphql
```

## Usage

### `createHandler`

```typescript
import { createHandler } from "@apollo/graphql-testing-library";

// We suggest using @graphql-tools/mock and @graphql-tools/schema
// to create a schema with mock resolvers.
// See https://the-guild.dev/graphql/tools/docs/mocking for more info.
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";

// Create an executable schema
const schema = makeExecutableSchema({ typeDefs });

// Add mock resolvers
const schemaWithMocks = addMocksToSchema({
  schema,
  resolvers: {
    Query: {
      products: () =>
        Array.from({ length: 5 }, (_element, id) => ({
          id: `product-${id}`,
        })),
    },
  },
});

// `createHandler` returns an object with a `handler` and `replaceSchema`
// function: `handler` is a MSW handler that will intercept all GraphQL
// operations, and `replaceSchema` allows you to replace the mock schema
// the `handler` use to resolve requests against.
const { handler, replaceSchema } = createHandler(schemaWithMocks, {
  // It accepts a config object as the second argument where you can specify a 
  // delay min and max, which will add random delays to your tests within the /
  // threshold to simulate a real network connection.
  // Default: delay: { min: 300, max: 300 }
  delay: { min: 200, max: 500 },
});
```
