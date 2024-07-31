import { gql } from "graphql-tag";
import { execute } from "@graphql-tools/executor";
import { isNodeProcess } from "is-node-process";
import {
  type ExecutionResult,
  type GraphQLSchema,
  type ASTNode,
  type DocumentNode,
  type GraphQLResolveInfo,
  GraphQLEnumType,
  type GraphQLEnumValue,
  isUnionType,
  isInterfaceType,
  isObjectType,
  isScalarType,
} from "graphql";
import { visit, BREAK } from "graphql";
import { HttpResponse, graphql, delay as mswDelay } from "msw";
import type {
  InitialIncrementalExecutionResult,
  SingularExecutionResult,
  SubsequentIncrementalExecutionResult,
} from "@graphql-tools/executor";
import {
  addResolversToSchema,
  makeExecutableSchema,
} from "@graphql-tools/schema";
import {
  addMocksToSchema,
  type IMocks,
  type IMockStore,
} from "@graphql-tools/mock";
import { mergeResolvers } from "@graphql-tools/merge";

const encoder = new TextEncoder();

export function hasDirectives(names: string[], root: ASTNode, all?: boolean) {
  const nameSet = new Set(names);
  const uniqueCount = nameSet.size;

  visit(root, {
    Directive(node) {
      if (nameSet.delete(node.name.value) && (!all || !nameSet.size)) {
        return BREAK;
      }
    },
  });

  // If we found all the names, nameSet will be empty. If we only care about
  // finding some of them, the < condition is sufficient.
  return all ? !nameSet.size : nameSet.size < uniqueCount;
}

type Delay = number | "infinite" | "real";

interface DelayOptions {
  delay?: Delay;
}

type DocumentResolversWithOptions<TResolvers> = {
  typeDefs: DocumentNode;
  resolvers: Partial<TResolvers> | ((store: IMockStore) => Partial<TResolvers>);
  mocks?: IMocks<TResolvers>;
} & DelayOptions;

type SchemaWithOptions = {
  schema: GraphQLSchema;
} & DelayOptions;

// Generates a Map of possible types. The keys are Union | Interface type names
// which map to Sets of either union members or types that implement the
// interface.
const createPossibleTypesMap = (executableSchema: GraphQLSchema) => {
  const typeMap = executableSchema.getTypeMap();
  const typesMap = new Map<string, Set<string>>();

  for (const typeName of Object.keys(typeMap)) {
    const type = typeMap[typeName];

    if (isUnionType(type) && !typesMap.has(typeName)) {
      typesMap.set(typeName, new Set(type.getTypes().map((item) => item.name)));
    }

    if (isObjectType(type) && type.getInterfaces().length > 0) {
      for (const interfaceType of type.getInterfaces()) {
        if (typesMap.has(interfaceType.name)) {
          const setOfTypes = typesMap.get(interfaceType.name);
          if (setOfTypes) {
            typesMap.set(
              interfaceType.name,
              new Set([...Array.from(setOfTypes), typeName]),
            );
          }
        } else {
          typesMap.set(interfaceType.name, new Set([typeName]));
        }
      }
    }
  }
  return typesMap;
};

// From a Map of possible types, create
const createDefaultResolvers = (typesMap: Map<string, Set<string>>) => {
  const defaultResolvers: {
    [key: string]: {
      __resolveType(data: { __typename?: string }): string;
    };
  } = {};

  for (const key of typesMap.keys()) {
    defaultResolvers[key] = {
      __resolveType(data: { __typename?: string }) {
        return data.__typename || typesMap.get(key)?.values().next().value;
      },
    };
  }
  return defaultResolvers;
};

const sortEnumsByValue = () => {
  const key = "value";
  return (a: GraphQLEnumValue, b: GraphQLEnumValue) =>
    a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
};

// TODO: memoize
// Creates a map of enum types and mock resolver functions that return
// the first possible value.
export const mockEnums = (schema: GraphQLSchema) => {
  return Object.fromEntries(
    Object.entries(schema.getTypeMap())
      .filter(
        (arg): arg is [string, GraphQLEnumType] =>
          arg[1] instanceof GraphQLEnumType,
      )
      .map(([typeName, type]) => {
        const value = type
          .getValues()
          .concat()
          .sort(sortEnumsByValue())[0]?.value;
        return [typeName, () => value] as const;
      }),
  );
};

const mockScalars = (schema: GraphQLSchema) => {
  const typeMap = schema.getTypeMap();
  const mockScalarsMap: Record<string, () => string> = {};

  for (const typeName of Object.keys(typeMap)) {
    const type = typeMap[typeName];
    if (isScalarType(type) && type.astNode) {
      // console.log(typeName, type);
      mockScalarsMap[typeName] = () =>
        `Default value for custom scalar \`${typeName}\``;
    }
  }
  return mockScalarsMap;
};

export const createHandler = <TResolvers>(
  documentResolversWithOptions: DocumentResolversWithOptions<TResolvers>,
) => {
  const { resolvers, typeDefs, mocks, ...rest } = documentResolversWithOptions;

  let executableSchema = makeExecutableSchema({ typeDefs });

  const enumMocks = mockEnums(executableSchema);
  const typesMap = createPossibleTypesMap(executableSchema);
  const defaultResolvers = createDefaultResolvers(typesMap);
  const defaultMockScalars = mockScalars(executableSchema);

  let schemaWithMocks = addMocksToSchema<TResolvers>({
    schema: executableSchema,
    // TODO: combine with default custom scalar mocks and user-defined scalar mocks
    mocks: { ...enumMocks, ...defaultMockScalars },
    resolvers,
    preserveResolvers: true,
  });

  return createHandlerFromSchema({ schema: schemaWithMocks, ...rest });
};

export const createHandlerFromSchema = (
  schemaWithOptions: SchemaWithOptions,
) => {
  const { schema, delay } = schemaWithOptions;

  let _delay = delay ?? "real";
  // The default node server response time in MSW's delay utility is 5ms.
  // See https://github.com/mswjs/msw/blob/main/src/core/delay.ts#L16
  // This sometimes caused multipart responses to be batched into a single
  // render by React, so we'll use a longer delay of 20ms.
  if (_delay === "real" && isNodeProcess()) {
    _delay = 20;
  }

  let testSchema: GraphQLSchema = schema;

  function replaceSchema(newSchema: GraphQLSchema) {
    const oldSchema = testSchema;

    testSchema = newSchema;

    function restore() {
      testSchema = oldSchema;
    }

    return Object.assign(restore, {
      [Symbol.dispose]() {
        restore();
      },
    });
  }

  // TODO:
  // function replaceResolvers() {}

  // TODO:
  // function mergeResolvers() {}

  function replaceDelay(newDelay: Delay) {
    const oldDelay = _delay;
    _delay = newDelay;

    function restore() {
      _delay = oldDelay;
    }

    return Object.assign(restore, {
      [Symbol.dispose]() {
        restore();
      },
    });
  }

  Object.defineProperty(replaceDelay, "currentDelay", {
    get() {
      return _delay;
    },
  });

  const boundaryStr = "-";
  const contentType = "Content-Type: application/json";
  const boundary = `--${boundaryStr}`;
  const terminatingBoundary = `--${boundaryStr}--`;
  const CRLF = "\r\n";

  function createChunkArray(
    value:
      | InitialIncrementalExecutionResult<any, Record<string, unknown>>
      | SubsequentIncrementalExecutionResult<any, Record<string, unknown>>,
  ) {
    return [
      CRLF,
      boundary,
      CRLF,
      contentType,
      CRLF,
      CRLF,
      JSON.stringify(value),
    ];
  }

  return {
    handler: graphql.operation<
      ExecutionResult<Record<string, unknown>, Record<string, unknown>>
      // @ts-expect-error FIXME: mismatch on the return type between HttpResponse
      // with a stream vs. json
    >(async ({ query, variables, operationName }) => {
      const document = gql(query);
      const hasDeferOrStream = hasDirectives(["defer", "stream"], document);

      if (hasDeferOrStream) {
        const result = await execute({
          document,
          operationName,
          schema: testSchema,
          variableValues: variables,
        });

        const chunks: Array<string> = [];

        if ("initialResult" in result) {
          chunks.push(...createChunkArray(result.initialResult));
        }

        let finished = false;
        if ("subsequentResults" in result) {
          while (!finished) {
            const nextResult = await result.subsequentResults.next();

            if (nextResult.value) {
              const currentResult = createChunkArray(nextResult.value);

              if (nextResult.value && !nextResult.value.hasNext) {
                finished = true;
                currentResult.push(CRLF, terminatingBoundary, CRLF);
              }

              chunks.push(...currentResult);
            }
          }
        }

        const stream = new ReadableStream({
          async start(controller) {
            try {
              for (const chunk of chunks) {
                if (
                  ![CRLF, contentType, terminatingBoundary, boundary].includes(
                    chunk,
                  )
                ) {
                  await mswDelay(_delay);
                }
                controller.enqueue(encoder.encode(chunk));
              }
            } finally {
              controller.close();
            }
          },
        });

        return new HttpResponse(stream, {
          headers: {
            "Content-Type": "multipart/mixed",
          },
        });
      } else {
        const result = await execute({
          document,
          operationName,
          schema: testSchema,
          variableValues: variables,
        });

        await mswDelay(_delay);

        return HttpResponse.json(result as SingularExecutionResult<any, any>);
      }
    }),
    replaceSchema,
    replaceDelay,
  };
};
