'use client';

import { useRouter } from 'next/navigation';

export default function OrderProduct() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/');
  };
  return (
    <>
      <h1>Order product</h1>
      <button
        onClick={handleClick}
        className="px-4 py-2 m-2 rounded-md bg-sky-600 text-slate-50 hover:bg-red-600">
        Place order
      </button>
    </>
  );
}
