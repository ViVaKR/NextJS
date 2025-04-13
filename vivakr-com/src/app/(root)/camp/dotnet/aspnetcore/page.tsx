import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function AspNetCorePage() {
    const title = 'ASP.NET Core';
    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={4} categoryName={title} />
        </div>
    );
}
