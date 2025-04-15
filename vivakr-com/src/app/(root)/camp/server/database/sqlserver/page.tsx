import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function SQLServerPage() {

  const title = 'SQL Server';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={49}
        categoryName={title} />
    </div>
  );
}
