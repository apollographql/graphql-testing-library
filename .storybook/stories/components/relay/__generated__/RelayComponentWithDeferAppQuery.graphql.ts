/**
 * @generated SignedSource<<05485eb90f8c7d75d8b2c69e733128a7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RelayComponentWithDeferAppQuery$variables = Record<
  PropertyKey,
  never
>;
export type RelayComponentWithDeferAppQuery$data = {
  readonly products:
    | ReadonlyArray<
        | {
            readonly id: string;
            readonly mediaUrl: string | null | undefined;
            readonly title: string | null | undefined;
            readonly " $fragmentSpreads": FragmentRefs<"RelayComponentReviewsFragment_product">;
          }
        | null
        | undefined
      >
    | null
    | undefined;
};
export type RelayComponentWithDeferAppQuery = {
  response: RelayComponentWithDeferAppQuery$data;
  variables: RelayComponentWithDeferAppQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "title",
      storageKey: null,
    },
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "mediaUrl",
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "RelayComponentWithDeferAppQuery",
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "Product",
          kind: "LinkedField",
          name: "products",
          plural: true,
          selections: [
            v0 /*: any*/,
            {
              kind: "Defer",
              selections: [
                {
                  args: null,
                  kind: "FragmentSpread",
                  name: "RelayComponentReviewsFragment_product",
                },
              ],
            },
            v1 /*: any*/,
            v2 /*: any*/,
          ],
          storageKey: null,
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [],
      kind: "Operation",
      name: "RelayComponentWithDeferAppQuery",
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "Product",
          kind: "LinkedField",
          name: "products",
          plural: true,
          selections: [
            v0 /*: any*/,
            {
              if: null,
              kind: "Defer",
              label:
                "RelayComponentWithDeferAppQuery$defer$RelayComponentReviewsFragment_product",
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "Review",
                  kind: "LinkedField",
                  name: "reviews",
                  plural: true,
                  selections: [
                    v0 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "rating",
                      storageKey: null,
                    },
                  ],
                  storageKey: null,
                },
              ],
            },
            v1 /*: any*/,
            v2 /*: any*/,
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "d39365cfca4b78af84446cd9fdb61a63",
      id: null,
      metadata: {},
      name: "RelayComponentWithDeferAppQuery",
      operationKind: "query",
      text: 'query RelayComponentWithDeferAppQuery {\n  products {\n    id\n    ...RelayComponentReviewsFragment_product @defer(label: "RelayComponentWithDeferAppQuery$defer$RelayComponentReviewsFragment_product")\n    title\n    mediaUrl\n  }\n}\n\nfragment RelayComponentReviewsFragment_product on Product {\n  reviews {\n    id\n    rating\n  }\n}\n',
    },
  };
})();

(node as any).hash = "f282e572ab3878c9ccb2f4ad43491878";

export default node;
