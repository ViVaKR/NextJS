import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function QnAPage() {

  const title = 'Mathematics';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={56}
        categoryName={title} />
    </div>
  );
}
