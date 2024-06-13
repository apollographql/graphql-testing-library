import "@testing-library/jest-dom";
import { gql } from "@apollo/client";
import { server } from "./src/__tests__/mocks/server.js";

gql.disableFragmentWarnings();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
