/**
 * @generated SignedSource<<843955ee0dad1a85c5d26675958f3437>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RelayComponentReviewsFragment_product$data = {
  readonly reviews: ReadonlyArray<{
    readonly content: string | null | undefined;
    readonly id: string;
    readonly rating: number | null | undefined;
  } | null | undefined> | null | undefined;
  readonly " $fragmentType": "RelayComponentReviewsFragment_product";
};
export type RelayComponentReviewsFragment_product$key = {
  readonly " $data"?: RelayComponentReviewsFragment_product$data;
  readonly " $fragmentSpreads": FragmentRefs<"RelayComponentReviewsFragment_product">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RelayComponentReviewsFragment_product",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Review",
      "kind": "LinkedField",
      "name": "reviews",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
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
  ],
  "type": "Product",
  "abstractKey": null
};

(node as any).hash = "5b7ce55ebe39bb7898d3e849a96ad6f3";

export default node;
