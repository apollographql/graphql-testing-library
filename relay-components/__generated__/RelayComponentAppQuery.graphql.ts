/**
 * @generated SignedSource<<fc398f27c364c7958b56d9f0a3e8fd57>>
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
    readonly reviews: ReadonlyArray<{
      readonly id: string;
    } | null | undefined> | null | undefined;
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
  "concreteType": "Review",
  "kind": "LinkedField",
  "name": "reviews",
  "plural": true,
  "selections": [
    (v0/*: any*/)
  ],
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaUrl",
  "storageKey": null
},
v4 = {
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
          (v1/*: any*/),
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
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
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
          (v1/*: any*/),
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
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4f3c2e36ebfad22b59ca2f814a9f0545",
    "id": null,
    "metadata": {},
    "name": "RelayComponentAppQuery",
    "operationKind": "query",
    "text": "query RelayComponentAppQuery {\n  products {\n    id\n    reviews {\n      id\n    }\n    ...RelayComponentReviewsFragment_product @defer(label: \"RelayComponentAppQuery$defer$RelayComponentReviewsFragment_product\")\n    title\n    mediaUrl\n    description\n  }\n}\n\nfragment RelayComponentReviewsFragment_product on Product {\n  reviews {\n    id\n    rating\n    content\n  }\n}\n"
  }
};
})();

(node as any).hash = "986bf3fa29378c60abd4ce663e7f1385";

export default node;
