import Link from 'next/link';

export default function Navbar() {

  return (
    <nav className="flex items-center
                        w-full
                        h-full
                        bg-sky-600
                        text-lg
                        font-bold
                        text-white
                        justify-evenly">
      <Link href={`/`}>Home</Link>
      <Link href={`/demo`}>Demo</Link>
      <Link href={`/text`}>Text</Link>
    </nav>
  )
}
