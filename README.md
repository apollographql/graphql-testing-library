# @apollo/graphql-testing-library

Peer dependencies:

- MSW
- graphql

To do:

- rename repo to @apollo/graphql-testing-library with disclaimer that we're not officially offiliated with RTL
- integration tests with Node + vitest?

Wish list:

- test helper to be used with MSW for replacing the schema if used with Node + Jest
- options:
  - random jitter timing min/max threshold
- what about different handlers for different error cases?
- subscriptions over multipart HTTP
- subscriptions over WS

# createHandler

- accepts a schema and options
- supports `@defer`
