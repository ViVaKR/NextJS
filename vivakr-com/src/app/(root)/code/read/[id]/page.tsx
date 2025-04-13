// src/app/code/read/page.tsx
import { Suspense } from 'react';
import CodeReadContent from './CodeReadContent';

export default function CodeReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CodeReadContent params={params} />
    </Suspense>
  );
}
