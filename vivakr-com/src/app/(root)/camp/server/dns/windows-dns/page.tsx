import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function WindowsDnsPage() {

  const title = 'Windows Serber DNS';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={55}
        categoryName={title} />
    </div>
  );
}
