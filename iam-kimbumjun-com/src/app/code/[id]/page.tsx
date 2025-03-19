// src/app/code/page.tsx
import VivTitle from '@/components/VivTitle';
import VivGridControl from '@/components/VivGridControl';
import { ICode } from '@/interfaces/i-code';
import { fetchCodes } from '@/lib/fetchCodes';
import { Suspense } from 'react';

export default async function CodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = (await params) ?? undefined;
  const codes: ICode[] = await fetchCodes();
  const filteredCodes = codes.filter((code) => code.categoryId === Number(id));
  return (
    <>
      <VivTitle title="코드조각" />
      <Suspense fallback={<div>로딩중...</div>}>
        <VivGridControl data={filteredCodes} />
      </Suspense>
    </>
  );
}
