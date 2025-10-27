// /odds/orm-demo/page.tsx
'use client'; // <-- 클라이언트 컴포넌트로 지정

import { useState, useEffect } from 'react';
import VivTitle from '@/components/VivTitle';
interface DemoItem {
  id: number;
  name: string;
}

// export const dynamic = 'force-dynamic'; // <-- 이 페이지를 동적으로 렌더링하도록 설정
export default function OddsOrmPrisma() {
  const [demos, setDemos] = useState<DemoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDemos() {
      try {
        // 위에서 만든 API 라우트 호출
        const response = await fetch('/api/demos');
        if (!response.ok) {
          // API 라우트에서 보낸 에러 메시지를 사용하거나 기본 메시지 설정
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch demos');
        }
        const data = await response.json();
        setDemos(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDemos();
  }, []); // 컴포넌트 마운트 시 1회 실행

  return (
    <div className="flex flex-col justify-baseline items-center">
      <VivTitle title="Prisma ORM Demo" />
      <div className="min-h-screen bg-gray-50 w-full rounded-2xl p-4 text-slate-400">
        {loading && <div>Loading demos...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        {!loading && !error && (
          <ol className="list-decimal list-inside font-noto]">
            {demos.map(
              (
                demo: DemoItem // 타입 명시
              ) => (
                <li
                  key={demo.id}
                  className="mb-2">
                  {demo.name}
                </li>
              )
            )}
          </ol>
        )}
      </div>
    </div>
  );
}
