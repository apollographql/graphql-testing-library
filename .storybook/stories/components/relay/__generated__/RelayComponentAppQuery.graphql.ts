/**
 * @generated SignedSource<<12bf2f218fc1496a2703731552a99cb9>>
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "RelayComponentReviewsFragment_product"
          },
          (v1/*: any*/),
          (v2/*: any*/)
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
              }
            ],
            "storageKey": null
          },
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0f4ff7bfd1b621ec073644a2e8b2a199",
    "id": null,
    "metadata": {},
    "name": "RelayComponentAppQuery",
    "operationKind": "query",
    "text": "query RelayComponentAppQuery {\n  products {\n    id\n    ...RelayComponentReviewsFragment_product\n    title\n    mediaUrl\n  }\n}\n\nfragment RelayComponentReviewsFragment_product on Product {\n  reviews {\n    id\n    rating\n  }\n}\n"
  }
};
})();

(node as any).hash = "03cceceba96fb0404eb4759dc44bb7c9";

export default node;
