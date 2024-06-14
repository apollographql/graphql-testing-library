import { gql } from "graphql-tag";
import { execute } from "@graphql-tools/executor";
import type { ExecutionResult, GraphQLSchema, ASTNode } from "graphql";
import { visit, BREAK } from "graphql";
import { HttpResponse, graphql } from "msw";
import type {
  InitialIncrementalExecutionResult,
  SingularExecutionResult,
  SubsequentIncrementalExecutionResult,
} from "@graphql-tools/executor";

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

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

interface Options {
  delay?: { min: number; max: number };
}

export const createHandler = (
  schema: GraphQLSchema,
  { delay }: Options = {}
) => {
  let testSchema: GraphQLSchema = schema;
  const delayMin = delay?.min ?? 300;
  const delayMax = delay?.max ?? delayMin + 300;

  if (delayMin > delayMax) {
    throw new Error(
      "Please configure a minimum delay that is less than the maximum delay. The default minimum delay is 3ms."
    );
  }

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

  const boundaryStr = "-";
  const contentType = "Content-Type: application/json";
  const boundary = `--${boundaryStr}`;
  const terminatingBoundary = `--${boundaryStr}--`;
  const CRLF = "\r\n";

  function createChunkArray(
    value:
      | InitialIncrementalExecutionResult<any, Record<string, unknown>>
      | SubsequentIncrementalExecutionResult<any, Record<string, unknown>>
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
      const hasDefer = hasDirectives(["defer"], document);
      const hasStream = hasDirectives(["stream"], document);

      if (hasDefer || hasStream) {
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
                if (delayMin > 0) {
                  const randomDelay =
                    Math.random() * (delayMax - delayMin) + delayMin;

                  if (chunk === boundary || chunk === terminatingBoundary) {
                    await wait(randomDelay);
                  }
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

        return HttpResponse.json(result as SingularExecutionResult<any, any>);
      }
    }),
    replaceSchema,
  };
};
