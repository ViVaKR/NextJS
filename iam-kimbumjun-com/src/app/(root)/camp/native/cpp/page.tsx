import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function CppPage() {

  const title = 'C++';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={47}
        categoryName={title} />
    </div>
  );
}
