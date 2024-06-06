import type { ReactNode } from "react";

type Product = {
  id: string;
  mediaUrl: string | null | undefined;
  title: string | null | undefined;
};

function Product({
  children,
  product,
}: {
  children: ReactNode;
  product: Product;
}) {
  return (
    <div key={product.id} className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img
          src={product.mediaUrl || ""}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href="#">
              <span aria-hidden="true" className="absolute inset-0" />
              {product.title}
            </a>
          </h3>
        </div>
        <p className="text-sm font-medium text-gray-900">{children}</p>
      </div>
    </div>
  );
}

type ReviewType = { rating: number; id: string };

function Reviews({ reviews }: { reviews: Array<ReviewType> }) {
  return reviews?.length > 0
    ? `${Math.round(
        reviews
          ?.map((i) => i.rating)
          .reduce((curr, acc) => {
            return curr + acc;
          }) / reviews.length
      )}/5`
    : "-";
}

export { Product, Reviews };
