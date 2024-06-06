/**
 * @generated SignedSource<<c3853a3faff397fafe6ad0095371cbdc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RelayComponentAppQuery$variables = Record<PropertyKey, never>;
export type RelayComponentAppQuery$data = {
  readonly products: ReadonlyArray<{
    readonly description: string | null | undefined;
    readonly id: string;
    readonly mediaUrl: string | null | undefined;
    readonly title: string | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"RelayComponentReviewsFragment_product">;
  } | null | undefined> | null | undefined;
};
export type RelayComponentAppQuery = {
  response: RelayComponentAppQuery$data;
  variables: RelayComponentAppQuery$variables;
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
    "name": "RelayComponentAppQuery",
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
    "name": "RelayComponentAppQuery",
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
            "label": "RelayComponentAppQuery$defer$RelayComponentReviewsFragment_product",
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
    "cacheID": "d8a71936337a80402d5cddfb525ec135",
    "id": null,
    "metadata": {},
    "name": "RelayComponentAppQuery",
    "operationKind": "query",
    "text": "query RelayComponentAppQuery {\n  products {\n    id\n    ...RelayComponentReviewsFragment_product @defer(label: \"RelayComponentAppQuery$defer$RelayComponentReviewsFragment_product\")\n    title\n    mediaUrl\n    description\n  }\n}\n\nfragment RelayComponentReviewsFragment_product on Product {\n  reviews {\n    id\n    rating\n    content\n  }\n}\n"
  }
};
})();

(node as any).hash = "34db6443c113b6471fea59a54e8029e9";

export default node;
