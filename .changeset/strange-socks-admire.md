---
"@apollo/graphql-testing-library": minor
---

Adds helper utilities `createDefaultResolvers`, `createPossibleTypesMap`, `generateEnumMocksFromSchema` and `mockCustomScalars` for those who want to manually create and configure their mock schema.

Also renames `createHandler` to `createHandlerFromSchema`; `createHandler` now provides an API that will create the mock schema under the hood with default resolvers as well as enum and custom scalar mocks.
