import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function JavaScriptPage() {

  const title = 'JavaScript';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={3}
        categoryName={title} />
    </div>
  );
}
