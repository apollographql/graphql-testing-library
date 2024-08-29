# @apollo/graphql-testing-library

## 0.3.0

### Minor Changes

- [#83](https://github.com/apollographql/graphql-testing-library/pull/83) [`2cf1dcd`](https://github.com/apollographql/graphql-testing-library/commit/2cf1dcda275a47fbb50d0f606cb271ab83450a37) Thanks [@alessbell](https://github.com/alessbell)! - Adds helper utilities `createDefaultResolvers`, `createPossibleTypesMap`, `generateEnumMocksFromSchema` and `mockCustomScalars` for those who want to manually create and configure their mock schema.

  Also renames `createHandler` to `createHandlerFromSchema`; `createHandler` now provides an API that will create the mock schema under the hood with default resolvers as well as enum and custom scalar mocks.

## 0.2.3

### Patch Changes

- [#60](https://github.com/apollographql/graphql-testing-library/pull/60) [`8896595`](https://github.com/apollographql/graphql-testing-library/commit/889659514d175c110d112f76062a241e50d19670) Thanks [@alessbell](https://github.com/alessbell)! - Bump default "real" delay in Node processes to 20ms.

## 0.2.2

### Patch Changes

- [#57](https://github.com/apollographql/graphql-testing-library/pull/57) [`47bf677`](https://github.com/apollographql/graphql-testing-library/commit/47bf6778dc2a89ebed5cc103006210d0da555522) Thanks [@alessbell](https://github.com/alessbell)! - Adds support for MSW's delay API and infinite loading states

## 0.2.1

### Patch Changes

- [#48](https://github.com/apollographql/graphql-testing-library/pull/48) [`5bd7d96`](https://github.com/apollographql/graphql-testing-library/commit/5bd7d9693f3f15306eda4a8ed80503e8b1ed0b83) Thanks [@alessbell](https://github.com/alessbell)! - Bumps @graphql-tools/executor version to v1.2.7 for GraphQL 15 backward-compatibility.

## 0.2.0

### Minor Changes

- [#41](https://github.com/apollographql/graphql-testing-library/pull/41) [`19212ce`](https://github.com/apollographql/graphql-testing-library/commit/19212ce1d72b612b26061d0e987a5f5ea38e24c1) Thanks [@alessbell](https://github.com/alessbell)! - Fix bundling issue caused by an unneeded files field in package.json, and adjust relative file paths.
