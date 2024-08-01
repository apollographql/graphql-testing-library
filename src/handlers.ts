import { gql } from "graphql-tag";
import { execute } from "@graphql-tools/executor";
import { isNodeProcess } from "is-node-process";
import {
  type ExecutionResult,
  type GraphQLSchema,
  type DocumentNode,
} from "graphql";
import { HttpResponse, graphql, delay as mswDelay } from "msw";
import type {
  InitialIncrementalExecutionResult,
  SingularExecutionResult,
  SubsequentIncrementalExecutionResult,
} from "@graphql-tools/executor";
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  addMocksToSchema,
  type IMocks,
  type IMockStore,
} from "@graphql-tools/mock";
import {
  createDefaultResolvers,
  createPossibleTypesMap,
  mockCustomScalars,
  mockEnums,
  hasDirectives,
} from "./utilities.ts";

const encoder = new TextEncoder();

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

export const createHandler = <TResolvers>(
  documentResolversWithOptions: DocumentResolversWithOptions<TResolvers>,
) => {
  const { resolvers, typeDefs, mocks, ...rest } = documentResolversWithOptions;

  let executableSchema = makeExecutableSchema({ typeDefs });

  const enumMocks = mockEnums<TResolvers>(executableSchema);
  const customScalarMocks = mockCustomScalars<TResolvers>(executableSchema);
  const typesMap = createPossibleTypesMap(executableSchema);
  const defaultResolvers = createDefaultResolvers(typesMap);

  let schemaWithMocks = addMocksToSchema<TResolvers>({
    schema: executableSchema,
    mocks: { ...enumMocks, ...customScalarMocks, ...mocks },
    resolvers: { ...defaultResolvers, ...resolvers },
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
