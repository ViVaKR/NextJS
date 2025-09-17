export default function FontPage() {

  return (
    <div className="h-dvh bg-amber-50 p-4 text-xl">


      <div className="flex justify-around gap-4 mb-4">

        <button type="button" className="focus:outline-2 border-none
        bg-red-400/50
        hover:bg-red-500
        hover:text-white
        cursor-pointer
        py-2 px-4
        rounded-lg
        outline-offset-2
        outline-sky-500">Button A</button>

        <button>Button B</button>
        <button>Button C</button>

      </div>

      <div className="mb-4 p-4 flex w-full border-2 border-dotted rounded-lg">
        <input type="text"
          className="border-2 border-slate-200 p-2
          outline-none
          focus:border-pink-700 w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-3 h-24 divide-x-4 divide-red-400 border-4 border-red-400">
        <div>

        </div>
        <div></div>
        <div></div>
      </div>

      <div className="h-24 p-4 flex gap-4 justify-evenly">
        <div className="size-12 bg-sky-400/50 border-x-4 border-red-400"></div>
        <div className="size-12 bg-red-400/20 border-b-4 border-sky-400"></div>
        <div className="size-12 bg-cyan-500 border-r-4 border-sky-800"></div>
        <div className="size-12 bg-amber-500 border-t-4 border-rose-500"></div>
        <div className="size-12 bg-violet-500 border-l-4 border-yellow-500"></div>
        <div className="size-12 bg-orange-400 border-y-4 border-indigo-500"></div>

        <div dir="ltr">
          <div className="size-12 border-s-4 bg-red-400"></div>
        </div>
      </div>

      <div className="mb-4 w-full h-auto flex flex-col gap-4">

        <div className="h-14 rounded-xl bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"></div>
        <div className="h-14 rounded-lg bg-linear-to-r from-cyan-500 to-blue-500"></div>
        <div className="h-14 rounded-lg bg-linear-to-t from-sky-500 to-indigo-500"></div>
        <div className="h-14 rounded-lg bg-linear-to-bl from-sky-400 to-red-600"></div>

        <div className="size-18 rounded-full bg-radial from-pink-400 from-50% to-pink-800"></div>
      </div>

      <div className="flex justify-evenly">
        <button className="bg-sky-500/50 px-8 py-4 rounded text-white text-base">Button A</button>
      </div>

      <div className="h-24
                    w-full
                    bg-linear-to-r
                    from-sky-500
                    to-red-500
                    mb-4
                    text-5xl
                    font-extrabold
                    text-transparent
                    flex-row-center
                    bg-clip-text
                    rounded-xl">
        Hello, World!!!!
      </div>

      <p className="bg-linear-to-r from-pink-500 to-violet-500
                    bg-clip-text
                    text-5xl

                    text-transparent
                    text-center
                    font-extrabold">
        Hello, World!
      </p>

      <div className="bg-robot
                      border-4
                      bg-indigo-500
                      bg-auto
                      bg-center
                      bg-no-repeat
                      h-96 my-8
                      p-3">
      </div>

      <p className="before:content-['Mobile']
                    md:before:content-['Desktop']
                    text-red-400
                    md:text-sky-400">

      </p>

      <p className="before:content-['Hello_World!_\_\__']">Fine Thanks</p>

      <div className="break-all">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate ea delectus iure a, nobis nesciunt est inventore hic labore fugiat eaque libero ut nihil quidem itaque saepe beatae iusto aut dolor! Dolores, ipsum ea sint ex impedit excepturi vitae voluptatem obcaecati beatae laudantium adipisci amet, dolorum nostrum in minus voluptate!
      </div>

      <div className="h-48">
        <span className="text-5xl">
          Lorem ipsum
        </span>
        <span className="inline-block align-middle">재빠른 갈색 여우가 게으른 개를 뛰어 넘는다.</span>
        <span className="text-5xl">Hello, World</span>
      </div>

      <p className="no-underline hover:underline
      decoration-dotted decoration-8
      underline-offset-8
      hover:cursor-pointer hover:decoration-pink-400">
        Lorem ipsum dolor sit amet.
      </p>
      <p className="my-4 text-ellipsis max-md:truncate text-red-400">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis, molestias exercitationem!
        Temporibus voluptate eligendi animi illo reiciendis soluta, consequuntur aut dolorem? Esse debitis amet sit odio architecto ab iure dolores.
      </p>

      <p className=" text-sky-500 mb-4 text-pretty -indent-8 p-8">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo tempore fugiat molestiae, officia cupiditate ex aliquid, vel cum exercitationem laudantium delectus nobis modi eius molestias quam neque, minus ipsa? Architecto? Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi eum, distinctio dolores, earum praesentium excepturi rerum, quidem alias vitae a molestias dolorem aliquid facere. Doloremque sapiente a excepturi ut veritatis! Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor mollitia ullam consequatur, qui eius quo praesentium voluptatum dignissimos aliquam corrupti saepe? Corrupti iure, voluptatum sequi officia consectetur quibusdam maxime facilis.
      </p>
      <p className="overline">
        Lorem ipsum dolor sit amet.
      </p>
      <p className="line-through">
        Lorem ipsum dolor sit amet.
      </p>
      <p className="underline">
        Lorem ipsum dolor sit amet.
      </p>


      <p className="text-justify">
        그래서 물속으로 걸어 들어가기 시작했어요. 솔직히 말해서, 정말 무서웠어요. 하지만 계속 걸었고, 파도를 지나가면서 묘한 평온함이 밀려왔어요. 신의 섭리였는지, 아니면 모든 생명체의 동질감 때문인지는 모르겠지만, 제리, 그 순간 난 해양 생물학자 였어 .
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate libero porro soluta officia ratione est culpa magni ducimus iusto nobis dolore expedita, ipsam unde minima eius possimus rem modi maiores.
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et tempore omnis aspernatur harum nam cupiditate sit eos eligendi molestiae, voluptatum deserunt veniam necessitatibus corrupti nulla, repellat accusantium voluptatibus vel ullam?
      </p>

      <ul className="mb-4 text-slate-600 list-disc mx-4">
        <li>Hello, World</li>
        <li>Hello, World</li>
        <li>Hello, World</li>
        <li>Hello, World</li>
        <li>Hello, World</li>
      </ul>

      <p className="text-base/10 mb-4 text-slate-500">
        그래서 물속으로 걸어 들어가기 시작했어요. 솔직히 말해서, 정말 무서웠어요. 하지만 계속 걸었고, 파도를 지나가면서 묘한 평온함이 밀려왔어요. 신의 섭리였는지, 아니면 모든 생명체의 동질감 때문인지는 모르겠지만, 제리, 그 순간 난 해양 생물학자 였어 .
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti illo officiis commodi laboriosam, velit nobis sint ullam cupiditate quisquam distinctio voluptatem itaque, assumenda nesciunt possimus consectetur praesentium, rem fugiat? Odit.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab consequuntur delectus necessitatibus laborum fuga porro nesciunt harum, ex, magnam tempore veniam officia odio maiores, repellendus qui amet ad similique quo!
      </p>

      <p className="text-sm leading-10 mb-4 text-slate-500">
        그래서 물속으로 걸어 들어가기 시작했어요. 솔직히 말해서, 정말 무서웠어요. 하지만 계속 걸었고, 파도를 지나가면서 묘한 평온함이 밀려왔어요. 신의 섭리였는지, 아니면 모든 생명체의 동질감 때문인지는 모르겠지만, 제리, 그 순간 난 해양 생물학자 였어 .
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti illo officiis commodi laboriosam, velit nobis sint ullam cupiditate quisquam distinctio voluptatem itaque, assumenda nesciunt possimus consectetur praesentium, rem fugiat? Odit.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab consequuntur delectus necessitatibus laborum fuga porro nesciunt harum, ex, magnam tempore veniam officia odio maiores, repellendus qui amet ad similique quo!
      </p>

      <p className="line-clamp-1">
        텍스트를 특정 줄 수로 제한하기

        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto eius a rem repellat commodi, voluptates ut officia, maxime quasi ipsa nemo inventore temporibus adipisci assumenda nostrum nobis unde nihil? Sapiente?
      </p>

      <p className="font-mono stacked-fractions">1/2 3/4 5/6</p>
      <p className="font-mono slashed-zero tabular-nums">10000</p>
      <p className="font-mono diagonal-fractions">1/2 3/4 5/6</p>
      <p className="font-sans diagonal-fractions">1/2 3/4 5/6</p>
      <p className="font-sans">Lorem ipsum dolor sit.</p>
      <p className="font-serif">Lorem ipsum dolor sit.</p>
      <p className="font-mono">Lorem ipsum dolor sit.</p>

      <p className="font-display text-3xl
      tracking-wide
      font-bold font-stretch-extra-expanded">

        Whereas recognition of the inherent dignity
        <br />
        <code className="text-base text-slate-400">
          tracking-tighter, tight, normal, wide, wider, widest
        </code>
      </p>
      <p className="font-cute my-4">
        안녕하세요 반갑습니다. 오늘 처리 합니다. 감사합니다.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque hic doloremque vitae corrupti dignissimos assumenda modi velit quibusdam, nam labore beatae repellendus quod saepe a soluta? Eveniet rerum ex facere.
      </p>
      <p className="font-ibm-kr font-medium  my-4">
        안녕하세요 반갑습니다. 오늘 처리 합니다. 감사합니다.
      </p>
      <p className="font-ibm-kr italic">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellendus dicta eos a ad sapiente, obcaecati, expedita saepe dolor vero labore consectetur ducimus alias nesciunt molestias iste doloremque, recusandae deleniti facere?
      </p>
      <ul className="flex flex-col gap-4 my-4 text-slate-500">
        <li className="font-roboto font-thin">
          font-thin : 100
        </li>
        <li className="font-extralight">
          font-extralight : 200
        </li>
        <li className="font-light">
          font-light : 300
        </li>
        <li>
          font-normal : 400
        </li>
        <li className="font-medium">
          font-medium : 500
        </li>
        <li className="font-semibold">
          font-semibold : 600
        </li>
        <li className="font-bold">
          font-bold : 700
        </li>
        <li className="font-extrabold">
          font-extrabold : 800
        </li>
        <li className="font-black">
          font-black : 900
        </li>
      </ul>

      <p className="font-sans stacked-fractions">1/2 3/4 5/6</p>

      <p className="font-stretch-extra-condensed">The quick brown fox...</p>
      <p className="font-stretch-condensed">The quick brown fox...</p>
      <p className="font-stretch-normal">The quick brown fox...</p>
      <p className="font-stretch-expanded">The quick brown fox...</p>
      <p className="font-stretch-extra-expanded">The quick brown fox...</p>
    </div>
  )
}
