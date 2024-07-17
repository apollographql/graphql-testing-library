/**
 * @generated SignedSource<<622b20ed5026c732388dc5f7e1487d6d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RelayComponentReviewsFragment_product$data = {
  readonly reviews:
    | ReadonlyArray<
        | {
            readonly id: string;
            readonly rating: number | null | undefined;
          }
        | null
        | undefined
      >
    | null
    | undefined;
  readonly " $fragmentType": "RelayComponentReviewsFragment_product";
};
export type RelayComponentReviewsFragment_product$key = {
  readonly " $data"?: RelayComponentReviewsFragment_product$data;
  readonly " $fragmentSpreads": FragmentRefs<"RelayComponentReviewsFragment_product">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "RelayComponentReviewsFragment_product",
  selections: [
    {
      alias: null,
      args: null,
      concreteType: "Review",
      kind: "LinkedField",
      name: "reviews",
      plural: true,
      selections: [
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "id",
          storageKey: null,
        },
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
  type: "Product",
  abstractKey: null,
};

(node as any).hash = "9017708b7b8d3c62f47be61c11fa4625";

export default node;
