import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function ReactPage() {
  const title = 'React';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={38}
        categoryName={title} />
    </div>
  );
}
