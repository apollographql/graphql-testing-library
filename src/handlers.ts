import { gql } from "graphql-tag";
import { execute, subscribe } from "@graphql-tools/executor";
import { isNodeProcess } from "is-node-process";
import type { GraphQLSchema, DocumentNode } from "graphql";
import {
  HttpResponse,
  delay as mswDelay,
  ws,
  type ResponseResolver,
} from "msw";
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
import {
  isAsyncGenerator,
  createDefaultResolvers,
  createPossibleTypesMap,
  mockCustomScalars,
  hasDirectives,
  generateEnumMocksFromSchema,
} from "./utilities.ts";
import type { IResolvers, Maybe } from "@graphql-tools/utils";
import { CustomRequestHandler } from "./requestHandler.ts";

const encoder = new TextEncoder();

type Delay = number | "infinite" | "real";

interface DelayOptions {
  delay?: Delay;
}

type DocumentResolversWithOptions<TResolvers> = {
  typeDefs: DocumentNode;
  resolvers: Resolvers<TResolvers>;
  mocks?: IMocks<TResolvers>;
} & DelayOptions;

type Resolvers<TResolvers> = TResolvers | ((store: IMockStore) => TResolvers);

type SchemaWithOptions<TResolvers> = {
  schema: GraphQLSchema;
  resolvers?: Resolvers<TResolvers>;
} & DelayOptions;

function createHandler<TResolvers>(
  documentResolversWithOptions: DocumentResolversWithOptions<TResolvers>,
) {
  const { resolvers, typeDefs, mocks, ...rest } = documentResolversWithOptions;

  const schemaWithMocks = createSchemaWithDefaultMocks<TResolvers>(
    typeDefs,
    resolvers,
    mocks,
  );

  return createHandlerFromSchema<TResolvers>({
    schema: schemaWithMocks,
    ...rest,
  });
}

function createSchemaWithDefaultMocks<TResolvers>(
  typeDefs: DocumentNode,
  resolvers?: TResolvers | ((store: IMockStore) => TResolvers),
  mocks?: IMocks<TResolvers>,
) {
  const executableSchema = makeExecutableSchema({ typeDefs });
  const enumMocks = generateEnumMocksFromSchema(executableSchema);
  const customScalarMocks = mockCustomScalars(executableSchema);
  const typesMap = createPossibleTypesMap(executableSchema);
  const defaultResolvers = createDefaultResolvers(typesMap);

  return addMocksToSchema<TResolvers>({
    schema: executableSchema,
    mocks: {
      ...enumMocks,
      ...customScalarMocks,
      ...mocks,
    } as IMocks<TResolvers>,
    resolvers: mergeResolvers([
      defaultResolvers,
      (resolvers ?? {}) as Maybe<
        IResolvers<{ __typename?: string | undefined }, unknown>
      >,
    ]) as TResolvers,
    preserveResolvers: true,
  });
}

function createHandlerFromSchema<TResolvers>(
  schemaWithOptions: SchemaWithOptions<TResolvers>,
) {
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

  function withResolvers(resolvers: Resolvers<TResolvers>) {
    const oldSchema = testSchema;

    testSchema = addResolversToSchema({
      schema: oldSchema,
      // @ts-expect-error reconcile mock resolver types
      resolvers,
    });

    function restore() {
      testSchema = oldSchema;
    }

    return Object.assign(restore, {
      [Symbol.dispose]() {
        restore();
      },
    });
  }

  function withMocks(mocks: IMocks<TResolvers>) {
    const oldSchema = testSchema;

    testSchema = addMocksToSchema({
      schema: oldSchema,
      mocks: mocks,
    });

    function restore() {
      testSchema = oldSchema;
    }

    return Object.assign(restore, {
      [Symbol.dispose]() {
        restore();
      },
    });
  }

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

  const requestHandler = createCustomRequestHandler();

  return Object.assign(
    requestHandler(async ({ query, variables, operationName }) => {
      const document = gql(query as string);
      const hasDeferOrStream = hasDirectives(["defer", "stream"], document);

      if (hasDeferOrStream) {
        const result = await execute({
          document,
          operationName: operationName as string,
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
          operationName: operationName as string,
          schema: testSchema,
          variableValues: variables,
        });

        await mswDelay(_delay);

        return HttpResponse.json(result as SingularExecutionResult<any, any>);
      }
    }),
    {
      replaceSchema,
      replaceDelay,
      withResolvers,
      withMocks,
    },
  );
}

const createCustomRequestHandler = () => {
  return (resolver: ResponseResolver) =>
    new CustomRequestHandler("all", new RegExp(".*"), "*", resolver);
};

function createWebSocketHandler<TResolvers>(
  documentResolversWithOptions: DocumentResolversWithOptions<TResolvers> & {
    uri?: string;
  },
) {
  let isComplete = false;
  const subscription = ws.link(
    documentResolversWithOptions.uri || "ws://localhost:4000/graphql",
  );

  const { resolvers, typeDefs, mocks } = documentResolversWithOptions;

  const schemaWithMocks = createSchemaWithDefaultMocks<TResolvers>(
    typeDefs,
    resolvers,
    mocks,
  );

  // function restore() {
  //   isComplete = false;
  // }

  const handler = Object.assign(
    subscription.on("connection", ({ client }) => {
      client.addEventListener("message", async (event) => {
        const json = JSON.parse(
          typeof event.data === "string" ? event.data : "",
        );

        if (json.type === "connection_init" && !isComplete) {
          client.send(JSON.stringify({ type: "connection_ack" }));
        }

        if (json.type === "subscribe" && !isComplete) {
          const result = await subscribe({
            schema: schemaWithMocks,
            document: gql(json.payload.query),
            operationName: json.payload.operationName,
            variableValues: json.payload.variables,
          });

          if (isAsyncGenerator(result)) {
            for await (const chunk of result) {
              client.send(
                JSON.stringify({
                  id: json.id,
                  type: "next",
                  payload: chunk,
                }),
              );
            }

            const next = await result.next();

            if (next.done && !isComplete) {
              isComplete = true;
              client.close(1000, "No more responses");
            }
          }
        }
      });
    }),
    {},
  );
  return handler;
}

export {
  createHandler,
  createWebSocketHandler,
  createHandlerFromSchema,
  createSchemaWithDefaultMocks,
};
