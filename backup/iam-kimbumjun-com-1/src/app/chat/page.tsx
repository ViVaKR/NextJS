// components/CategoryList.tsx
'use client'; // 클라이언트 컴포넌트로 지정

import { useState, useEffect } from 'react';
import { ICode } from '@/interfaces/i-code';

export default function CodeList() {
  const [categories, setCategories] = useState<ICode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/code`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Angular의 SkipLoading 대응: 로딩 상태를 별도로 관리하니까 추가 설정 불필요
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data: ICode[] = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [baseUrl]); // baseUrl이 바뀔 때마다 호출 (필요 시 의존성 제거 가능)

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.title}</li>
        ))}
      </ul>
    </div>
  );
}
