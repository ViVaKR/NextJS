

export default function FlexPage() {


  return (
    <div className="flex flex-col gap-4 p-2">
      <h1 className="text-3xl">Flex Demo</h1>


      <p className="subtitle-xl">flex-auto</p>

      <div className="flex h-48 bg-amber-200 text-slate-400">

        <div className="w-14 flex-none bg-amber-100">item-1</div>
        <div className="w-64 flex-auto bg-sky-100">item-2</div>
        <div className="w-32 flex-auto bg-rose-100">item-3</div>

      </div>
      <hr className="hr-viv" />
      <p className="subtitle-xl">size</p>
      <div className="flex h-64 text-xl text-slate-100">
        <div className="size-32 bg-sky-400 p-2">Size</div>
      </div>

      <hr className="hr-viv" />

      <p className="subtitle-xl">flex-initial : 초기 크기를 고려하여 플렉스 항목이 줄어들지만 늘어 나지 않도록 함</p>

      <div className="flex h-32 text-xl">
        <div className="w-32 flex-none bg-sky-400 text-white">01</div>
        <div className="w-[512px] flex-initial bg-yellow-400 text-slate-500">02</div>
        <div className="w-64 flex-initial bg-sky-400 text-white">03</div>
      </div>

      <hr className="hr-viv" />


      <p className="subtitle-xl">flex-auto</p>


      <div className="flex-viv-default bg-amber-100">
        <div className="w-14 flex-none bg-violet-400 text-white">01</div>
        <div className="w-64 flex-auto bg-indigo-400 text-white">02</div>
        <div className="w-32 flex-auto bg-lime-500 text-white">03</div>

      </div>

      <hr className="hr-viv" />

      <p className="subtitle-xl font-mono">grow</p>
      <div className="border border-slate-400 flex rounded-lg text-center align-text-bottom">

        {/* flex-none: prevent a flex item from growing or shrinking */}
        <div className="size-14 flex-none">01</div>

        {/* grow: to allow a flex item to grow to fill any abailabel space */}
        <div className="size-14 grow bg-sky-400">02</div>
        <div className="size-14 flex-none">03</div>
      </div>

      <hr />

      <p className="subtitle-xl font-mono">grow, grow-0, grow</p>

      <div className="flex gap-1.5">
        <div className="size-32 grow flex-row-center bg-orange-200">01</div>
        <div className="size-32 grow-0 flex-row-center bg-lime-200">02</div>
        <div className="size-32 grow flex-row-center bg-amber-200">03</div>
      </div>

      <hr />

      <p className="subtitle-xl font-mono">grow-number</p>

      <div className="flex gap-1 5">
        <div className="size-14 flex-row-center grow-3 bg-sky-200">01</div>
        <div className="size-14 flex-row-center grow-7 bg-red-200">02</div>
        <div className="size-14 flex-row-center grow-3 bg-amber-200">03</div>
      </div>

      <hr />

      <p className="subtitle-xl font-mono">flex-1, shrink-0, flex-1</p>
      <div className="flex gap-1.5">
        <div className="h-16 flex-1 flex-row-center bg-sky-200">01</div>
        <div className="h-16 w-64 shrink-0 flex-row-center bg-amber-200">02</div>
        <div className="h-16 flex-1 flex-row-center bg-red-200">03</div>
      </div>


    </div >
  )
}
