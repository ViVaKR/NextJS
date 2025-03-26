// src/app/code/layout.tsx

export const dynamic = 'force-dynamic';
import { fetchCodes } from '@/lib/fetchCodes';
import { fetchCategories } from '@/lib/fetchCategories';
import ClientLayout from '@/components/ClientLayout';
import { Suspense } from 'react';

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
    // <ClientLayout
    //   codes={codes}
    //   categories={categories}>
    //   {children}
    // </ClientLayout>
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClientLayout codes={codes} categories={categories}>
        {children}
      </ClientLayout>
    </Suspense>

  );
}
