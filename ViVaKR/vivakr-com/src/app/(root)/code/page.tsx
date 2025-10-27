// src/app/code/page.tsx
export const dynamic = 'force-dynamic'; // 동적 렌더링 강제
import VivTitle from '@/components/VivTitle';
import VivGridControl from '@/components/VivGridControl';
import { ICode } from '@/interfaces/i-code';
import { fetchCodesAsync } from '@/lib/fetchCodes';
import { Suspense } from 'react';

async function CodeList() {
  const codes: ICode[] = await fetchCodesAsync();
  return (
    <>
      <VivTitle title={`코드조각 (total: ${codes.length})`} />
      <VivGridControl
        data={codes}
        userId=""
      />
    </>
  );
}

export default async function CodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CodeList />
    </Suspense>
  );
}
