'use client';
import VivTitle from '@/components/VivTitle';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
export default function NotFound() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col w-full h-screen bg-white justify-start items-center">
      <Image
        src="/images/error-404.webp"
        width={800}
        height={600}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        alt="Error 404"
      />
      <em className="text-red-400 font-bold">{pathname}</em>
      <VivTitle title={`page not found`} />
    </div>
  );
}
