import "@testing-library/jest-dom";
// import { gql } from "@apollo/client";
import { server } from "./src/__tests__/mocks/server.js";
// import { beforeAll, afterAll, afterEach } from "@jest/globals";

// gql.disableFragmentWarnings();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
