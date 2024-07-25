import { gql } from "graphql-tag";
import { execute } from "@graphql-tools/executor";
import { isNodeProcess } from "is-node-process";
import type {
  ExecutionResult,
  GraphQLSchema,
  ASTNode,
  DocumentNode,
  GraphQLResolveInfo,
} from "graphql";
import { visit, BREAK } from "graphql";
import { HttpResponse, graphql, delay as mswDelay } from "msw";
import type {
  InitialIncrementalExecutionResult,
  SingularExecutionResult,
  SubsequentIncrementalExecutionResult,
} from "@graphql-tools/executor";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema, type IMockStore } from "@graphql-tools/mock";

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

type DocumentNodeAndResolversOptions<TResolvers> = {
  typeDefs: DocumentNode;
  resolvers: Partial<TResolvers> | ((store: IMockStore) => Partial<TResolvers>);
  schema?: never;
} & DelayOptions;

type SchemaOptions = {
  schema: GraphQLSchema;
  typeDefs?: never;
  resolvers?: never;
} & DelayOptions;

export type CreateHandlerDefinition<TResolvers> =
  | SchemaOptions
  | DocumentNodeAndResolversOptions<TResolvers>;

export const createHandler = <TResolvers>(
  schemaOrDocumentAndResolvers: CreateHandlerDefinition<TResolvers>,
) => {
  const { schema, resolvers, delay, typeDefs } = schemaOrDocumentAndResolvers;

  let executableSchema = schema ?? makeExecutableSchema({ typeDefs });

  let schemaWithMocks =
    schema ??
    addMocksToSchema<TResolvers>({
      schema: executableSchema,
      resolvers,
    });

  let _delay = delay ?? "real";
  // The default node server response time in MSW's delay utility is 5ms.
  // See https://github.com/mswjs/msw/blob/main/src/core/delay.ts#L16
  // This sometimes caused multipart responses to be batched into a single
  // render by React, so we'll use a longer delay of 20ms.
  if (_delay === "real" && isNodeProcess()) {
    _delay = 20;
  }

  let testSchema: GraphQLSchema = schemaWithMocks;

  function replaceSchema(
    newSchemaOrResolvers: Omit<
      CreateHandlerDefinition<TResolvers>,
      "delay" | "typeDefs"
    >,
  ) {
    const oldSchema = testSchema;

    const { schema: newSchema, resolvers: newResolvers } = newSchemaOrResolvers;

    testSchema =
      newSchema ??
      addMocksToSchema<TResolvers>({
        schema: executableSchema,
        resolvers: newResolvers,
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
