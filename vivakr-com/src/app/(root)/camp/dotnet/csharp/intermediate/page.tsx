import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function Page() {
    const title = 'C# Intermediate';
    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={2} categoryName={title} />
        </div>
    );
}
