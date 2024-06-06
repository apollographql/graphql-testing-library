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
const { clearImmediate } = require("node:timers");
const { performance } = require("node:perf_hooks");

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder }, // jest
  TextEncoder: { value: TextEncoder }, // jest
  ReadableStream: { value: ReadableStream }, // jest
  performance: { value: performance },
  clearImmediate: { value: clearImmediate },
});

const { Blob, File } = require("node:buffer");
const { fetch, Headers, FormData, Request, Response } = require("undici");

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true }, // jest
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response }, // jest
});

// Symbol.dispose is not defined
// jest bug: https://github.com/jestjs/jest/issues/14874
// fix is available in https://github.com/jestjs/jest/releases/tag/v30.0.0-alpha.3
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
