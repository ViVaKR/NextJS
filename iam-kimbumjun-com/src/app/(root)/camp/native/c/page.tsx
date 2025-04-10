import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function CPage() {

  const title = 'C';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={11}
        categoryName={title} />
    </div>
  );
}
