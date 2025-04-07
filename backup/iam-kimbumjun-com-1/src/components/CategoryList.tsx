// components/CategoryList.tsx
'use client'; // 클라이언트 컴포넌트로 지정

import { useState, useEffect } from 'react';
import { ICategory } from '@/interfaces/i-category';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';

export default function CategoryList() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // 기본값 설정

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/category/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Angular의 SkipLoading 대응: 로딩 상태를 별도로 관리하니까 추가 설정 불필요
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data: ICategory[] = await response.json();
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
    <>
      {categories.map((category, idx) => (
        <div
          key={idx}
          className="mb-1">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header">
              <Typography component="span">{category.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>{category.id}</AccordionDetails>
          </Accordion>
          {/* <CategoryAccordion categories={categories} codes={codes} /> */}
        </div>
      ))}
    </>
  );
}
