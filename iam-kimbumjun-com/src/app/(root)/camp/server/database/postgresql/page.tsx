import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function PostgeSQLPage() {

  const title = 'PostgreSQL';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={48}
        categoryName={title} />
    </div>
  );
}
