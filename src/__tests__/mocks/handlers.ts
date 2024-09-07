import ecommerceSchema from "../../../.storybook/stories/schemas/ecommerce.graphql";
import type { Resolvers } from "../../__generated__/resolvers-types-ecommerce.ts";
import { createHandler } from "../../handlers.js";

const products = ["beanie", "bottle", "cap", "onesie", "shirt", "socks"];
const productImgURL = "https://storage.googleapis.com/hack-the-supergraph";

const ecommerceHandler = createHandler<Resolvers>({
  typeDefs: ecommerceSchema,
  resolvers: {
    Query: {
      products: () =>
        products.map((_element, index) => ({
          id: `${index}`,
          title: products[index],
          mediaUrl: `${productImgURL}/apollo-${products[index]}.jpg`,
          reviews: [
            {
              id: `review-${index}`,
              rating: index * 2,
            },
          ],
        })),
    },
  },
});

const handlers = [ecommerceHandler];

export { handlers, products, ecommerceHandler };
