import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function ApachePage() {

  const title = 'Apache HTTP Server';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={54}
        categoryName={title} />
    </div>
  );
}
