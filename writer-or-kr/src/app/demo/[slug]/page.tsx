import { ISlug } from "@/interfaces/i-slug";

export default async function Page({ params }: {
  params: Promise<ISlug>
}) {

  const { slug } = await params;

  return (

    <div className="w-full h-[100svh] p-4 bg-slate-50">

      <h1 className="text-3xl">
        Demo
      </h1>
      <p className="text-slate-400">
        {slug}
      </p>

    </div>

  )
}

