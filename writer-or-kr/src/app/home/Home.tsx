'use client'

import React, { useEffect, useState } from 'react';

// 1. 데이터 구조에 맞는 인터페이스 정의
// interface PostData {
//   userId: number;
//   id: number;
//   title: string;
//   body: string;
// }

interface resData {
  message: string
}

export default function Home() {
  const [data, setData] = useState<resData | null>(null);

  useEffect(() => {
    const fetchData = async () => {

      // const response = await fetch('http://localhost:8081');
      const response = await fetch('/api/extern');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setData(data);

    };
    fetchData().catch((e) => {
      console.error('An Error:', e)
    });
    // Cleanup function (optional)
    return () => {
      // Cleanup code here
    }
  }, [ /* dependencies*/]);

  return (
    <div>
      <h1>Home</h1>
      <p>
        title {data?.message}
      </p>
    </div>
  )
}
