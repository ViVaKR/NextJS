import { notFound } from 'next/navigation';

export default function ReviewDetail({
  params,
}: {
  params: {
    reviewId: string;
    productId: string;
  };
}) {
  if (
    !params.reviewId ||
    !params.productId ||
    parseInt(params.reviewId) > 1000
  ) {
    return notFound();
  }
  return (
    <div className="text-red-400 text-3xl">
      <h1>
        Review {params.reviewId} for product {params.productId}
      </h1>
    </div>
  );
}
