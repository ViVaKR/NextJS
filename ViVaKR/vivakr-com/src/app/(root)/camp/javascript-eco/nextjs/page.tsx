import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function NextJsPage() {
  const title = 'Next.js';
  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={15}
        categoryName={title} />
    </div>
  );
}
