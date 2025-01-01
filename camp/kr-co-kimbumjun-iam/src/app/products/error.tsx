'use client';
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex justify-evenly my-2 items-center">
      {error.message}{' '}
      <button
        className="mx-2 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white bg-sky-600 text-slate-50"
        onClick={reset}>
        Try again
      </button>
    </div>
  );
}
