import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function IISPage() {
  const title = 'Microsoft Internet Information';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={55}
        categoryName={title} />
    </div>
  );
}
