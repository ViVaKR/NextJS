import IncrementalCodes from "@/components/IncrementalCodes";
import VivTitle from "@/components/VivTitle";

export default function PowerShellPage() {

  const title = 'PowerShell';

  return (
    <div className='mx-2'>
      <VivTitle title={title} />
      <IncrementalCodes
        categoryId={20}
        categoryName={title} />
    </div>
  );
}
