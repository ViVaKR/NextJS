// src/data
'use client'; // 클라이언트 컴포넌트로 지정

import { useState, useEffect } from 'react';
import { ICode } from '@/interfaces/i-code';

export default function CodeData(): ICode[] {
  const [codes, setCodes] = useState<ICode[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL; // 기본값 설정
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/code`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data: ICode[] = await response.json();
        setCodes(data);
      } catch (err) {
        throw err;
      }
    };

    fetchCodes();
  }, [baseUrl]); // baseUrl이 바뀔 때마다 호출 (필요 시 의존성 제거 가능)

  return codes;
}
