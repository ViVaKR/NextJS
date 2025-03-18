import VivTitle from '@/components/Title';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const title = '부트캠프';
  const { slug } = await params;

  return (
    <>
      <VivTitle title={title} />
      <div>Boot Camp Segments: `{slug}`</div>
    </>
  );
}
