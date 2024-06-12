# @apollo/graphql-testing-library

Peer dependencies:

- MSW
- graphql

To do:

- build process: copy "leaner" package.json into dist, can omit dev dependencies and scripts
- find how to run ts-jest with ESM or try vitest
- rename repo to @apollo/graphql-testing-library with disclaimer that we're not officially offiliated with RTL
- integration tests with Node + vitest?
- options:
  - random jitter timing min/max threshold

# createHandler

- accepts a schema and options
- supports `@defer`
