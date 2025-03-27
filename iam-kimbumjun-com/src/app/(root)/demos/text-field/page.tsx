'use client'
import InputWithIcon from '@/components/mui-textfield';
import { useEffect, useMemo, useState } from 'react';


export default function Page() {
  const [age, setAge] = useState(0);
  const [complete, setComplete] = useState(true);

  /*
  1. useMemo

  용도: 값(객체, 배열, 계산 결과 등)을 메모이제이션.
  반환: 계산된 값 자체.

               반환값
  useMemo : 값(객체, 배열 등 ), 값의 계산 비용 절감, 무거운 계산, 배열 필터링, 복잡한 객체 생성
  useCallback : 함수        , 함수 참조 유지 (자식 컴포넌트 전달)

  */


  // const whether = useMemo(() => {
  //   return {
  //     state: complete ? '완료됨' : '진행중'
  //   };
  // }, [complete]);

  const whether = useMemo(() => ({ state: complete ? '완료됨' : '진행중' }), [complete]);

  useEffect(() => {
    // age 변경시는 작동안함
    // whether 변경시에만 작동함
    console.log('useEffected ??');
  }, [whether])


  const handleChange = () => {
    setAge(age + 1);

  }

  return (
    <>
      <InputWithIcon />
      <div className='flex flex-col gap-2 mx-4'>
        <p>{age}</p>
        <input
          type="number"
          value={age}
          className='p-2 border-2 rounded-md text-center '
          placeholder="나이를 입력하세요."
          onChange={handleChange}
        />
        <button

          onClick={() => setComplete(!complete)}>{whether.state}</button>
      </div>

    </>
  );
}
