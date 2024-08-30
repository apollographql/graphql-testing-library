import statuses from "@bundled-es-modules/statuses";
import { format } from "outvariant";

import {
  GraphQLHandler,
  type GraphQLVariables,
  type Match,
  type ParsedGraphQLRequest,
} from "msw";

// These utilities are taken wholesale from MSW, as they're not exported from
// the package, in order to build an augmented version of MSW's
// graphql.operation catchall request handler class.

// MIT License

// Copyright (c) 2018–present Artem Zakharchenko

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// From https://github.com/mswjs/msw/blob/63b78315cdbe8435f9e6ec627022d67fa38a9703/src/core/handlers/GraphQLHandler.ts#L35
export type GraphQLRequestParsedResult = {
  match: Match;
  cookies: Record<string, string>;
} & (
  | ParsedGraphQLRequest<GraphQLVariables>
  /**
   * An empty version of the ParsedGraphQLRequest
   * which simplifies the return type of the resolver
   * when the request is to a non-matching endpoint
   */
  | {
      operationType?: undefined;
      operationName?: undefined;
      query?: undefined;
      variables?: undefined;
    }
);

export interface LoggedRequest {
  url: URL;
  method: string;
  headers: Record<string, string>;
  body: string;
}

export interface SerializedResponse {
  status: number;
  statusText: string;
  headers: Record<string, any>;
  body: string;
}

export async function serializeRequest(
  request: Request,
): Promise<LoggedRequest> {
  const requestClone = request.clone();
  const requestText = await requestClone.text();

  return {
    url: new URL(request.url),
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: requestText,
  };
}

const { message } = statuses;

export async function serializeResponse(
  response: Response,
): Promise<SerializedResponse> {
  const responseClone = response.clone();
  const responseText = await responseClone.text();

  // Normalize the response status and status text when logging
  // since the default Response instance doesn't infer status texts
  // from status codes. This has no effect on the actual response instance.
  const responseStatus = responseClone.status || 200;
  const responseStatusText =
    responseClone.statusText || message[responseStatus] || "OK";

  return {
    status: responseStatus,
    statusText: responseStatusText,
    headers: Object.fromEntries(responseClone.headers.entries()),
    body: responseText,
  };
}

export function getTimestamp(): string {
  const now = new Date();

  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(String)
    .map((chunk) => chunk.slice(0, 2))
    .map((chunk) => chunk.padStart(2, "0"))
    .join(":");
}

export enum StatusCodeColor {
  Success = "#69AB32",
  Warning = "#F0BB4B",
  Danger = "#E95F5D",
}

/**
 * Returns a HEX color for a given response status code number.
 */
export function getStatusCodeColor(status: number): StatusCodeColor {
  if (status < 300) {
    return StatusCodeColor.Success;
  }

  if (status < 400) {
    return StatusCodeColor.Warning;
  }

  return StatusCodeColor.Danger;
}

const LIBRARY_PREFIX = "[MSW]";

/**
 * Formats a given message by appending the library's prefix string.
 */
function formatMessage(message: string, ...positionals: any[]): string {
  const interpolatedMessage = format(message, ...positionals);
  return `${LIBRARY_PREFIX} ${interpolatedMessage}`;
}

const devUtils = {
  formatMessage,
};

export class CustomRequestHandler extends GraphQLHandler {
  override async log(args: {
    request: Request;
    response: Response;
    parsedResult: GraphQLRequestParsedResult;
  }) {
    const loggedRequest = await serializeRequest(args.request);
    const loggedResponse = await serializeResponse(args.response);
    const statusColor = getStatusCodeColor(loggedResponse.status);
    const requestInfo = args.parsedResult.operationName
      ? `${args.parsedResult.operationType} ${args.parsedResult.operationName}`
      : `anonymous ${args.parsedResult.operationType}`;

    console.groupCollapsed(
      devUtils.formatMessage(
        `${getTimestamp()} ${requestInfo} (%c${loggedResponse.status} ${
          loggedResponse.statusText
        }%c)`,
      ),
      `color:${statusColor}`,
      "color:inherit",
    );
    console.log("Request:", loggedRequest);
    console.log("Handler:", this);
    console.log("Response:", loggedResponse);
    console.groupEnd();
  }
}
