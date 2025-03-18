// src/app/code/layout.tsx
export const dynamic = 'force-dynamic';
import { fetchCodes } from '@/lib/fetchCodes';
import { fetchCategories } from '@/lib/fetchCategories';
import ClientLayout from '@/components/ClientLayout';
import { Suspense } from 'react';
import Loading from '@/components/VivLoading';

async function fetchData() {
  const [codes, categories] = await Promise.all([
    fetchCodes(),
    fetchCategories(),
  ]);
  return { codes, categories };
}

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { codes, categories } = await fetchData();
  return (
    <Suspense fallback={<Loading params={{ choice: 3 }} />}>
      <ClientLayout
        codes={codes}
        categories={categories}>
        {children}
      </ClientLayout>
    </Suspense>
  );
}
