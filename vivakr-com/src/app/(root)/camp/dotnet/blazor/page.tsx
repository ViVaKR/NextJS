import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function BlazorPage() {
    const title = 'Blazor';
    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={5} categoryName={title} />
        </div>
    );
}
