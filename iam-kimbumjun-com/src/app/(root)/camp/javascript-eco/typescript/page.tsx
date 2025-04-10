import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function TypeScriptPage() {

  const title = 'TypeScript';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={20}
        categoryName={title} />
    </div>
  );
}
