
// import { Suspense } from "react";
// import CodeReadContent from "./CodeReadContent";


// export default async function CodeReadPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   // const resolveParams = await params;
//   // const id = resolveParams.id; // string 타입 유지
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <CodeReadContent params={params} /> {/* Promise 그대로 전달 */}
//     </Suspense>
//   );
// }
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
