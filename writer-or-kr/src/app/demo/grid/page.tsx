

export default function GridPage() {


  return (

    <div className="p-0">


      <div className="h-fit bg-amber-50 p-4 flex gap-4">
        <div className="size-16 bg-sky-400 text-white flex-row-center text-xs">size-16</div>
        <div className="size-20 bg-sky-400 text-white flex-row-center text-xs">size-20</div>
        <div className="size-24 bg-sky-400 text-white flex-row-center text-xs">size-24</div>
        <div className="size-32 bg-sky-400 text-white flex-row-center text-xs">size-32</div>
        <div className="size-42 bg-sky-400 text-white flex-row-center text-xs">size-42</div>
        <div className="size-[12rem] bg-sky-400 text-white flex-row-center text-xs">size-[12rem]</div>
        <div className="size bg-sky-400 text-white flex-row-center text-xs">size-[12rem]</div>

      </div>


      <div className="grid grid-cols-2 h-48 place-items-stretch border gap-4 mb-8">
        <div className="bg-amber-300 p-4">01</div>
        <div className="bg-amber-300 p-4">02</div>
        <div className="bg-amber-300 p-4">03</div>
        <div className="bg-amber-300 p-4">04</div>
      </div>

      <div className="flex items-stretch gap-4 mb-4">
        <div className="self-end flex-row-center rounded-lg basis-1/3 bg-teal-300">01</div>
        <div className="self-start flex-row-center rounded-lg flex-1 bg-teal-300">02</div>
        <div className="py-8 flex-row-center rounded-lg flex-1 bg-teal-300">03</div>
      </div>

      <div className="grid h-56 grid-cols-3 content-evenly bg-slate-200 gap-4 mb-4">
        <div className="flex-row-center h-auto rounded-lg bg-violet-400 text-white">01</div>
        <div className="flex-row-center h-auto rounded-lg bg-violet-400 text-white">02</div>
        <div className="flex-row-center h-auto rounded-lg bg-violet-400 text-white">03</div>
        <div className="flex-row-center h-auto rounded-lg bg-violet-400 text-white">04</div>
        <div className="flex-row-center h-auto rounded-lg bg-violet-400 text-white">05</div>
      </div>

      <div className="grid grid-cols-3 justify-items-stretch gap-4 h-48 mb-4">
        <div className="justify-self-start w-auto p-4
        flex-row-center rounded-md bg-sky-400 text-white">01</div>
        <div className="justify-self-center w-auto p-4 flex-row-center rounded-md bg-sky-400 text-white">02</div>
        <div className="justify-self-end w-auto p-4 flex-row-center rounded-md bg-sky-400 text-white">03</div>
        <div className="justify-self-center-safe w-auto p-4 flex-row-center rounded-md bg-sky-400 text-white">04</div>
        <div className="w-auto p-4 flex-row-center rounded-md bg-sky-400 text-white">05</div>
        <div className="w-auto p-4 flex-row-center rounded-md bg-sky-400 text-white">06</div>
      </div>

      <div className="grid grid-cols-[4rem_auto_4rem] justify-stretch h-24 gap-4 mb-4">
        <div className="bg-pink-400 rounded-lg flex-row-center text-white">1</div>
        <div className="bg-pink-400 rounded-lg flex-row-center text-white">2</div>
        <div className="bg-pink-400 rounded-lg flex-row-center text-white">3</div>
      </div>

      <div className="flex justify-start md:justify-between gap-4 mb-4">

        {/*
          * justify-center :
          * justify-center-safe : 사용 가능한 공간이 충분하지 않으면 중앙이 아닌 시작 부분에 맞춤
          * Justify-end :
          * justify-end-safe :
          * justify-between : 각 항목 사이에 동일한 크기의 공간을 배치
          * justify-around : 각 측면에 동일한 크기의 공간을 배치
          * justify-evenly : 항목 주위의 모든 공간을 동일하게 배치

        */}

        <div className="size-14 bg-amber-400 rounded-lg flex-row-center">01</div>
        <div className="size-14 bg-amber-400 rounded-lg flex-row-center">02</div>
        <div className="size-14 bg-amber-400 rounded-lg flex-row-center">03</div>
        <div className="size-14 bg-amber-400 rounded-lg flex-row-center">04</div>
      </div>

      <div className="grid grid-flow-col grid-rows-3 gap-4 mb-4">
        <div className="flex-row-center row-span-3 bg-pink-500 text-white rounded-lg">01</div>
        <div className="flex-row-center col-span-2 bg-pink-500 text-white rounded-lg">02</div>
        <div className="flex-row-center col-span-2 row-span-2 bg-pink-500 text-white  rounded-lg">03</div>

      </div>

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-blue-200 rounded-lg flex-row-center text-red-600 h-12">01</div>
        <div className="bg-blue-200 rounded-lg flex-row-center text-red-600 h-12">02</div>
        <div className="bg-blue-200 rounded-lg flex-row-center text-red-600 h-12">03</div>
        <div className="bg-blue-400 rounded-lg flex-row-center text-red-600 h-full
        row-span-2
        col-span-2">04</div>
        <div className="bg-blue-200 rounded-lg flex-row-center text-red-600 h-12">05</div>
        <div className="bg-blue-200 rounded-lg flex-row-center text-red-600 h-12">06</div>
        <div className="bg-blue-400 rounded-lg flex-row-center text-red-600 h-12 col-span-2">07</div>

      </div>
      <hr className="hr-viv" />

      {/* 반응형 */}
      <div className="grid grid-col-1 md:grid-cols-6 gap-4">
        <div className="h-14 w-auto flex-row-center rounded-lg bg-sky-200">01</div>
        <div className="h-14 w-auto flex-row-center rounded-lg bg-sky-200">02</div>
        <div className="h-14 w-auto flex-row-center rounded-lg bg-sky-200">03</div>
        <div className="h-14 w-auto flex-row-center rounded-lg bg-sky-200">04</div>
        <div className="h-14 w-auto flex-row-center rounded-lg bg-sky-200">05</div>
        <div className="h-14 w-auto flex-row-center rounded-lg bg-sky-200">06</div>
        <div className="h-14 w-auto flex-row-center rounded-lg bg-sky-200">07</div>
        <div className="h-14 w-auto flex-row-center rounded-lg bg-sky-200">08</div>
        <div className="h-14 w-auto flex-row-center rounded-lg bg-sky-200">09</div>
      </div>

      <hr className="hr-viv" />

      {/*  */}
      <div className="grid grid-cols-[200px_1fr_100px] h-96 gap-2">

        <div className="bg-sky-400 text-white">01</div>
        <div className="bg-slate-100">02</div>
        <div className="bg-yellow-100 text-slate-400">03</div>
      </div>

      <hr className="hr-viv" />
      <p className="subtitle-xl">grid</p>

      <div className="grid grid-cols-4 gap-4">

        <div className="w-32 h-16 bg-pink-400 text-white flex-row-center rounded-xl">01</div>
        <div className="w-32 h-16 bg-pink-400 text-white flex-row-center rounded-xl">02</div>
        <div className="w-32 h-16 bg-pink-400 text-white flex-row-center rounded-xl">03</div>
        <div className="w-32 h-16 bg-pink-400 text-white flex-row-center rounded-xl">04</div>
        <div className="w-32 h-16 bg-pink-400 text-white flex-row-center rounded-xl">05</div>
        <div className="w-32 h-16 bg-pink-400 text-white flex-row-center rounded-xl">06</div>
        <div className="w-32 h-16 bg-pink-400 text-white flex-row-center rounded-xl">07</div>
        <div className="w-32 h-16 bg-pink-400 text-white flex-row-center rounded-xl">08</div>
        <div className="w-32 h-16 bg-pink-400 text-white flex-row-center rounded-xl">09</div>
        <div className="w-32 h-16 bg-pink-400 text-white flex-row-center rounded-xl">10</div>

      </div>
    </div>
  )
}
