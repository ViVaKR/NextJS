import Image from 'next/image';
import marbleImage from '@/images/person.png'
import examImage from '@/images/funny.webp'
import Link from "next/link";

export default function Home() {

  const imageStyle = {
    borderRadius: '50%',
    border: '0.25rem solid lightblue',
    width: '200px',
    height: 'auto',
    backgroundColor: 'skyblue',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }

  return (
    <div className="w-full
                    min-h-screen
                    flex
                    flex-col
                    bg-gradient-to-b
                    from-sky-200
                    to-sky-800
                    justify-center items-center">

      <div className="flex w-full p-8 bg-sky-200 items-center">

        <Link href={`/marble`} className="flex items-end gap-12 text-sky-800">
          <Image
            alt="-"
            style={imageStyle}
            src={marbleImage}
          />
          <h1>게임 플레이</h1>
        </Link>
      </div>
      <div className="flex w-full p-8 bg-sky-300 items-center">

        <Link href={`/marble/exam`} className="flex items-end gap-12 text-sky-800">
          <Image
            alt="-"
            style={imageStyle}
            src={examImage}
          />
          <h1>문제 출제</h1>
        </Link>
      </div>


      {/* <MarbleGame /> */}

    </div>
  );
}
