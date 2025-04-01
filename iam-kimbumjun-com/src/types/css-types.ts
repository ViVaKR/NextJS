// 'black', 'blue', 'white'만 허용하도록 타입 정의
export type VivColor = 'black'
    | 'red' | 'orange' | 'amber' | 'yellow'
    | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
    | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
    | 'pink' | 'rose' | 'slate' | 'gray' | 'zinc'
    | 'neutral' | 'stone' | 'white';

// Tailwind의 폰트 크기 클래스만 허용
export type VivSize = 'xs'
    | 'sm'
    | 'base'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl';

export type VivBoxSize = 'small' | 'medium' | 'large';
