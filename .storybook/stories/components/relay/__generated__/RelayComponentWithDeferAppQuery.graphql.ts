/**
 * @generated SignedSource<<67e68fd02a277ad442924bac7db281d6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RelayComponentWithDeferAppQuery$variables = Record<PropertyKey, never>;
export type RelayComponentWithDeferAppQuery$data = {
  readonly products: ReadonlyArray<{
    readonly description: string | null | undefined;
    readonly id: string;
    readonly mediaUrl: string | null | undefined;
    readonly title: string | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"RelayComponentReviewsFragment_product">;
  } | null | undefined> | null | undefined;
};
export type RelayComponentWithDeferAppQuery = {
  response: RelayComponentWithDeferAppQuery$data;
  variables: RelayComponentWithDeferAppQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaUrl",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RelayComponentWithDeferAppQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Product",
        "kind": "LinkedField",
        "name": "products",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "kind": "Defer",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "RelayComponentReviewsFragment_product"
              }
            ]
          },
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RelayComponentWithDeferAppQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Product",
        "kind": "LinkedField",
        "name": "products",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "if": null,
            "kind": "Defer",
            "label": "RelayComponentWithDeferAppQuery$defer$RelayComponentReviewsFragment_product",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Review",
                "kind": "LinkedField",
                "name": "reviews",
                "plural": true,
                "selections": [
                  (v0/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "rating",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "content",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ]
          },
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5d0a1e385798573ffda670a713f233e4",
    "id": null,
    "metadata": {},
    "name": "RelayComponentWithDeferAppQuery",
    "operationKind": "query",
    "text": "query RelayComponentWithDeferAppQuery {\n  products {\n    id\n    ...RelayComponentReviewsFragment_product @defer(label: \"RelayComponentWithDeferAppQuery$defer$RelayComponentReviewsFragment_product\")\n    title\n    mediaUrl\n    description\n  }\n}\n\nfragment RelayComponentReviewsFragment_product on Product {\n  reviews {\n    id\n    rating\n    content\n  }\n}\n"
  }
};
})();

(node as any).hash = "191fcdc886b10cd48ed92df8b781b5c0";

export default node;
