'use client';
import { notFound } from 'next/navigation';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function ReviewDetail({
  params,
}: {
  params: {
    reviewId: string;
    productId: string;
  };
}) {
  const random = getRandomInt(2);
  if (random === 1) {
    throw new Error('Error loading review');
  }

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
