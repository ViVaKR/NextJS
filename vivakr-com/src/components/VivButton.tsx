import { VivColor, VivBoxSize, VivSize } from '@/types/css-types';

export function VivButton({
  color = 'black',
  text = '버튼',
  fontSize = 'base',
  buttonSize = 'medium',
  click,
}: {
  color?: VivColor; // number 대신 더 구체적인 타입 사용
  text: string;
  fontSize?: VivSize;
  buttonSize?: VivBoxSize;
  click?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const colors: Record<VivColor, string> = {
    black:
      'bg-black\
       text-amber-300 hover:bg-amber-600 hover:text-black', // 검정 → 황토 (황토 → 검정)

    red: 'bg-red-400\
    text-teal-900 hover:bg-teal-600 hover:text-red-100', // 빨강 → 청록 (청록 → 밝은 빨강)

    orange:
      'bg-orange-400\
     text-blue-900 hover:bg-blue-600 hover:text-orange-100', // 주황 → 파랑 (파랑 → 밝은 주황)

    amber:
      'bg-amber-400\
      text-indigo-900 hover:bg-indigo-600 hover:text-amber-100', // 황토 → 남색 (남색 → 밝은 황토)

    yellow:
      'bg-yellow-400\
       text-violet-900 hover:bg-violet-600 hover:text-yellow-100', // 노랑 → 보라 (보라 → 밝은 노랑)

    lime: 'bg-lime-400 text-purple-900 hover:bg-purple-600 hover:text-lime-100', // 라임 → 자주 (자주 → 밝은 라임)

    green:
      'bg-green-400\
     text-rose-900 hover:bg-rose-600 hover:text-green-100', // 초록 → 장미 (장미 → 밝은 초록)

    emerald:
      'bg-emerald-400 text-red-900 hover:bg-red-600 hover:text-emerald-100', // 에메랄드 → 적갈색 (빨강 → 밝은 에메랄드)

    teal: 'bg-teal-400 text-orange-900 hover:bg-orange-600 hover:text-teal-100', // 청록 → 주황 (주황 → 밝은 청록)

    cyan: 'bg-cyan-400 text-red-900 hover:bg-red-600 hover:text-cyan-100', // 청록 → 적갈색 (빨강 → 밝은 청록)

    sky: 'bg-sky-400 text-red-900 hover:bg-red-600 hover:text-cyan-100', // 하늘 → 적갈색 (빨강 → 밝은 청록)

    blue: 'bg-blue-400 text-yellow-200 hover:bg-orange-600 hover:text-blue-100', // 파랑 → 주황 (주황 → 밝은 파랑)

    indigo:
      'bg-indigo-400 text-amber-400 hover:bg-amber-600 hover:text-indigo-100', // 남색 → 황토 (황토 → 밝은 남색)

    violet:
      'bg-violet-400 text-lime-400 hover:bg-lime-600 hover:text-violet-100', // 보라 → 라임 (라임 → 밝은 보라)

    purple:
      'bg-purple-400 text-lime-400 hover:bg-lime-600 hover:text-purple-100', // 자주 → 라임 (라임 → 밝은 자주)

    fuchsia:
      'bg-fuchsia-400 text-lime-400 hover:bg-lime-600 hover:text-purple-100', // 자홍 → 라임 (라임 → 밝은 자주)

    pink: 'bg-pink-400 text-teal-900 hover:bg-teal-600 hover:text-pink-100', // 분홍 → 청록 (청록 → 밝은 분홍)

    rose: 'bg-rose-400 text-green-900 hover:bg-green-600 hover:text-rose-100', // 장미 → 초록 (초록 → 밝은 장미)

    slate:
      'bg-slate-400 text-orange-800 hover:bg-orange-600 hover:text-slate-100', // 회청 → 주황 (주황 → 밝은 회청)

    gray: 'bg-gray-400 text-orange-800 hover:bg-orange-600 hover:text-gray-100', // 회색 → 주황 (주황 → 밝은 회색)

    zinc: 'bg-zinc-400 text-orange-800 hover:bg-orange-600 hover:text-zinc-100', // 아연 → 주황 (주황 → 밝은 아연)

    neutral:
      'bg-neutral-400 text-orange-800 hover:bg-orange-600 hover:text-neutral-100', // 중립 → 주황 (주황 → 밝은 중립)

    stone:
      'bg-stone-400 text-orange-800 hover:bg-orange-600 hover:text-stone-100', // 돌 → 주황 (주황 → 밝은 돌)

    white: 'bg-white text-gray-900 hover:bg-gray-600 hover:text-white', // 흰색 → 회색 (회색 → 흰색)
  };

  const fs: Record<VivSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
    '9xl': 'text-9xl',
  };
  const sizes: Record<VivBoxSize, string> = {
    small: 'px-2 py-1 rounded-md',
    medium: 'px-4 py-2 rounded-xl',
    large: 'px-6 py-3 rounded-2xl',
  };

  const clicked = (e: React.MouseEvent) => {
    //
  };

  return (
    <button
      onClick={click ? click : (e: React.MouseEvent) => clicked(e)}
      className={`${colors[color]} ${fs[fontSize]} ${sizes[buttonSize]} cursor-pointer`}>
      {text}
    </button>
  );
}

export function DefaultButton({
  click,
  text,
}: {
  click: (e: React.MouseEvent<HTMLButtonElement>) => void;

  text: string;
}) {
  return (
    <button
      onClick={click}
      className="cursor-pointer hover:bg-red-400 rounded-xl
      border-2 border-red-400">
      {text}
    </button>
  );
}
