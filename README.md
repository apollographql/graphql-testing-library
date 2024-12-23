<div align="center" data-test>
  <a href="https://graphql.org/">
    <img width="150" height="150" src="https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg">
  </a>
  <a href="https://mswjs.io/">
    <img width="150" height="150" src="https://raw.githubusercontent.com/mswjs/msw/main/media/msw-logo.svg">
  </a>

  <h1>GraphQL Testing Library</h1>

  <p>Generate Mock Service Worker handlers for your GraphQL APIs.</p>

[![npm version](https://badge.fury.io/js/%40apollo%2Fgraphql-testing-library.svg)](https://badge.fury.io/js/%40apollo%2Fgraphql-testing-library) ![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/alessbell/3fd56e82b55e134ee9cf57f28b0b3d49/raw/jest-coverage-comment__main.json) ![workflow](https://github.com/apollographql/graphql-testing-library/actions/workflows/test.yml/badge.svg)

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
  // delay duration, which uses MSW's delay API:
  // https://mswjs.io/docs/api/delay
  // Default: "real" (100-400ms in browsers, 20ms in Node-like processes)
  delay: number | "infinite" | "real",
});
```
