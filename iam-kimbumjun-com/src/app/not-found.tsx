'use client';
import VivTitle from '@/components/VivTitle';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
export default function NotFound() {
  const pathname = usePathname();

  const id = pathname.split('/');
  return (
    <div className="flex flex-col h-screen w-full bg-white justify-start items-center">
      <Image
        src="/images/error-404.webp"
        width={800}
        height={500}
        alt=""
      />
      <VivTitle title={`'${id.join('/')}' page not found`} />
    </div>
  );
}
