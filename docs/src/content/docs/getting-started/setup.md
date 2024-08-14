---
title: Set up
# description: A guide in my new Starlight docs site.
---

## Usage in Node.js

Let's set up [Mock Service Worker](https://mswjs.io/docs) and configure it with GraphQL Testing Library for use in a [Node.js environment](https://mswjs.io/docs/integrations/node) with popular test runners like [Jest](https://jestjs.io/) and [Vitest](https://vitest.dev/).

### With Jest

In order to use GraphQL Testing Library and MSW with Jest, missing Node.js globals must be polyfilled in your environment.

Create a `jest.polyfills.js` file with the following contents:

```ts
// jest.polyfills.js
/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 * These HAVE to be require's and HAVE to be in this exact
 * order, since "undici" depends on the "TextEncoder" global API.
 *
 * Consider migrating to a more modern test runner if
 * you don't want to deal with this.
 */

const { TextDecoder, TextEncoder } = require("node:util");
const { ReadableStream } = require("node:stream/web");

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
});

const { Blob, File } = require("node:buffer");
const { fetch, Headers, FormData, Request, Response } = require("undici");

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
});

// Polyfill for "Symbol.dispose is not defined" error
// Jest bug: https://github.com/jestjs/jest/issues/14874
// The fix is available in https://github.com/jestjs/jest/releases/tag/v30.0.0-alpha.3 - this polyfill is necessary for earlier versions
if (!Symbol.dispose) {
  Object.defineProperty(Symbol, "dispose", {
    value: Symbol("dispose"),
  });
}
if (!Symbol.asyncDispose) {
  Object.defineProperty(Symbol, "asyncDispose", {
    value: Symbol("asyncDispose"),
  });
}
```

This file mostly contains the [Jest polyfills recommended by MSW](https://mswjs.io/docs/faq/#requestresponsetextencoder-is-not-defined-jest), with two additions: the version above includes `ReadableStream` which is needed for incremental delivery features, and a polyfill for `Symbol.dispose` which is not available in Jest in versions before `30.0.0-alpha.3`.

> Be sure to also install `undici`, the official fetch implementation in Node.js.

Then, set the `setupFiles` option in `jest.config.js` to point to your `jest.polyfills.js`:

```js
// jest.config.js
module.exports = {
  setupFiles: ["./jest.polyfills.js"],
};
```

Next, follow the Mock Service Worker documentation for [setting up MSW in Node.js](https://mswjs.io/docs/integrations/node).

Finally, install `@graphql-tools/jest-transform` as a dev dependency and configure Jest to transform `.gql`/`.graphql` files, since your GraphQL API's schema is needed to configure the Mock Service Worker [request handler](https://mswjs.io/docs/concepts/request-handler/) this library generates.

Here are the relevant parts of your final `jest.config.js`:

```js
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["./jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  // Opt out of the browser export condition for MSW tests.
  // For more information, see:
  // https://github.com/mswjs/msw/issues/1786#issuecomment-1782559851
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  transform: {
    "\\.(gql|graphql)$": "@graphql-tools/jest-transform",
  },
};
```

### With Vitest

No polyfills are needed in Vitest.

## Usage in a broswer environment

### With Storybook
