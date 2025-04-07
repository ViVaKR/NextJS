import { use } from 'react';
import { notFound } from 'next/navigation';
export default async function DemoDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (parseInt(id) > 100) {
    notFound();
  }
  return (
    <>
      <h1 className="text-sky-400">DemoDetails ( {id} )</h1>
    </>
  );
}
