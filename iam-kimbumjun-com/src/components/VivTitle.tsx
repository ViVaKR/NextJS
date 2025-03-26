import { Cute_Font } from 'next/font/google'
const cute = Cute_Font({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

interface VivTitleProps {
  title: string;
  fontColor?: string;
}

export default function VivTitle({
  title,
  fontColor,
}: VivTitleProps) {
  return (
    <h2
      className={`${fontColor ?? 'text-sky-800'
        } ${cute.className}
        rounded-full
         text-center
         font-cute`}>
      {title}
    </h2>
  );
}
