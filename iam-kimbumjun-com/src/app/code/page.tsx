// src/app/code/page.tsx
export const dynamic = 'force-dynamic'; // 동적 렌더링 강제
import VivTitle from '@/components/VivTitle';
import VivGridControl from '@/components/VivGridControl';
import VivLoading from '@/components/VivLoading';
import { ICode } from '@/interfaces/i-code';
import { fetchCodes } from '@/lib/fetchCodes';
import { Suspense } from 'react';

async function CodeList() {
  const codes: ICode[] = await fetchCodes();
  return <VivGridControl data={codes} />;
}

export default async function CodePage() {
  return (
    <>
      <VivTitle title="코드조각" />
      <Suspense fallback={<VivLoading params={{ choice: 1 }} />}>
        <CodeList />
        <CodeList />
      </Suspense>
    </>
  );
}
