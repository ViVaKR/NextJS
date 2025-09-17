'use client';

export default function Home() {

    return (
        <div className="p-4">

            <h1>Home</h1>

            <p className="text-tahiti bg-midnight py-2 px-4 my-4 rounded-md">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae ipsum fugiat iusto quas, dolores, magni vitae consectetur maxime provident voluptate impedit dolore qui nulla voluptatum atque, corrupti voluptatem incidunt necessitatibus.
            </p>
            <h3 className="font-kr">Hello, World Fine Thanks And You? 한글, font-kr </h3>
            <h3 className="font-poppins">Hello, World Fine Thanks And You? 한글</h3>

            <div className="card max-w-80 h-48 my-8">
                Card
            </div>

            <div className="box-sm">
                <p className="ordinal">1st</p>
                <p className="slashed-zero">0</p>
                <p className="text-tiny">
                    한글 테스트 ...
                </p>
            </div>

            <div className="box-sm-col bg-teal-500 text-white
                    my-2 p-4 h-auto">
                <p className="font-stretch-extra-condensed">
                    Lorem ipsum dolor sit.
                </p>
                <p className="font-stretch-condensed"> The quick </p>
                <p className="font-stretch-normal">
                    Lorem ipsum dolor sit.
                </p>
                <p className="font-stretch-120% ">
                    Lorem ipsum dolor sit.
                </p>
                <span className="!font-stretch-extra-expanded">
                    Lorem ipsum dolor sit.
                </span>
            </div>

            <div className="box-sm bg-fuchsia-500 text-white h-20 my-2">
                <p className="subpixel-antialiased">subpixel antialiased...</p>
                <p className="antialiased">antialiased...</p>
                <p className="italic md:not-italic">italic</p>
            </div>

            <div className="box-sm bg-amber-100 h-20">
                <p className="font-mono text-[12px]">font mono text-[12px]...</p>
                <p className="text-tiny">Text Tiny</p>
                <p className="text-sm/6 bg-slate-400">line height 6...</p>
                <p className="text-sm/7 bg-slate-400">line height 7...</p>
                <p className="text-sm/8 bg-slate-400">line height 8...</p>
            </div>

            <div className="box-sm mb-4 p-4">
                <button className="btn-rose shadow-xl/50 h-10 shadow-slate-950">Button A</button>
            </div>

            <div className="w-full flex justify-around mb-8">
                <p className="text-shadow-lg/50 text-white bg-slate-500 py-2 px-8 rounded-md">The quick brown fox jumps over the lazy dog.</p>

            </div>

            <div className="w-full flex justify-around mb-8">
                <div className="ring ring-blue-500/50 w-20 rounded-2xl p-8"></div>
                <div className="ring-2 ring-sky-500/50 w-20 rounded-2xl p-8"></div>
                <div className="ring-4 ring-sky-500/50 w-20 rounded-2xl p-8"></div>
            </div>

            <div className="w-full flex justify-around">
                <div className="shadow-xl/50 w-28
                                rounded-md p-2 bg-cyan-500">
                    Subscribe
                </div>
                <div className="shadow-lg shadow-blue-500/50 w-28
                                h-28 flex justify-center items-center
                                rounded-md bg-blue-500">
                    Subscribe
                </div>
                <div className="shadow-lg shadow-indigo-500/50 w-28
                                rounded-md p-2 bg-indigo-500">
                    Subscribe
                </div>
            </div>
            <div className="w-full flex flex-row justify-around gap-8">
                <div className="shadow-xl/20 w-52 h-52 my-8"></div>
                <div className="shadow-xl/40 w-52 h-52 my-8"></div>
                <div className="shadow-xl/60 w-52 h-52 my-8"></div>
            </div>

            <div className="w-48 h-48 bg-amber-300 p-5 shadow-xs">Box</div>
            <div className="bg-robot w-56 h-56 my-1"></div>
            <button className="btn-primary my-2">Click</button>
        </div>
    )
}
