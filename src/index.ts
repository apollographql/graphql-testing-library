import {
  createHandler,
  createHandlerFromSchema,
  createSchemaWithDefaultMocks,
} from "./handlers.js";
import {
  mockEnums,
  mergeResolvers,
  mockCustomScalars,
  createPossibleTypesMap,
  createDefaultResolvers,
  type ResolverMap,
} from "./utilities.ts";

export type { ResolverMap };

export {
  createHandler,
  createHandlerFromSchema,
  mockEnums,
  mergeResolvers,
  mockCustomScalars,
  createPossibleTypesMap,
  createDefaultResolvers,
  createSchemaWithDefaultMocks,
};
