import Image from 'next/image';

export default function Home() {
  return (
    <>

      <div className="text-center text-3xl font-bold">Hello, World</div>
      <Image src="/man.png" alt="Man" width={50} height={50} />
    </>
  );
}
