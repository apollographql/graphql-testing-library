<div align="center">
  <h1>GraphQL Testing Library</h1>

  <!-- <a href="https://www.apollographql.com/"><img src="https://raw.githubusercontent.com/apollographql/apollo-client-devtools/main/assets/apollo-wordmark.svg" height="100" alt="Apollo Client"></a> -->

  <p>Testing utilities that encourage good practices for apps built with GraphQL.</p>

</div>
<hr />

**GraphQL Testing Library** provides utilities that make it easy to generate [Mock Service Worker](https://mswjs.io/) handlers for any GraphQL API.

MSW is the [Testing Library-recommended](https://testing-library.com/docs/react-testing-library/example-intro/#full-example) way to declaratively mock API communication in your tests without stubbing `window.fetch`.

This library currently supports incremental delivery features `@defer` and `@stream` out of the box, with plans to add support for subscriptions over multipart HTTP and possibly WebSockets which are [currently in beta in MSW](https://github.com/mswjs/msw/discussions/2010).

> This project is not affiliated with the ["Testing Library"](https://github.com/testing-library) ecosystem that inspired it. We're just fans :)


## Installation

```
npm install --save-dev @apollo/graphql-testing-library
```

or for installation via yarn

```
yarn add --dev @apollo/graphql-testing-library
```

This library has `peerDependencies` listings for `msw` at `^2.0.0` and `graphql` at `^15.0.0 || ^16.0.0`.

```
npm install --save-dev msw graphql


yarn add --dev msw graphql
```

## Usage

### `createHandler`

```typescript
import { createHandler } from "@apollo/graphql-testing-library";
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

// createHandler returns an object with `handler` and `replaceSchema`
// functions: `handler` is your MSW handler, and `replaceSchema` can
// be used in tests to pass a new `schemaWithMocks` that your `handler`
// with use to resolve requests against
const { handler, replaceSchema } = createHandler(schemaWithMocks, {
  delay: { min: 200, max: 500 },
});
```
