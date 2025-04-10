import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function AssemblyPage() {
  const title = 'Assembly';
  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={23}
        categoryName={title} />
    </div>
  );
}
