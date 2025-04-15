import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function MongoDbPage() {

  const title = 'MongoDB';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={52}
        categoryName={title} />
    </div>
  );
}
