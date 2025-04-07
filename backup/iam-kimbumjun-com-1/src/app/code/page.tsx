// src/app/code/page.tsx
export const dynamic = 'force-dynamic'; // 동적 렌더링 강제
import VivTitle from '@/components/Title';
import VivGridControl from '@/components/VivGridControl';
import Loading from '@/components/VivLoading';
import { ICode } from '@/interfaces/i-code';
import { fetchCodes } from '@/lib/fetchCodes';
import { Suspense } from 'react';

async function CodeList() {
  const codes: ICode[] = await fetchCodes();

  return (
    <>
      <VivGridControl data={codes} />
    </>

  );
}

export default async function CodePage() {
  // const secretKey = process.env.SESSION_SECRET;
  return (
    <>
      <VivTitle title="코드조각" />
      {/* <p className="bg-gray-400 text-white">{secretKey}</p> */}
      <Suspense fallback={<Loading params={{ choice: 1 }} />}>
        <CodeList />
      </Suspense>

    </>
  );
}


{/*
      --> Suspense란?
      React.Suspense는 React에서 비동기 작업(예: 데이터 페칭, 코드 스플리팅)을 처리할 때 컴포넌트가 준비될 때까지 대기하고, 그동안 대체 UI(즉, fallback)를 보여주는 기능을 제공해. Next.js에서도 많이 활용되는데, 특히 서버 사이드 렌더링(SSR)과 클라이언트 사이드 렌더링(CSR)을 조화롭게 다룰 때 유용해.
*/}
// <ul>
//   {codes.length > 0 &&
//     codes
//       .sort((a, b) => b.id - a.id)
//       .map((code) => (
//         <li key={code.id}>
//           {code.id}. {code.title}
//         </li>
//       ))}
//   { }
// </ul>
