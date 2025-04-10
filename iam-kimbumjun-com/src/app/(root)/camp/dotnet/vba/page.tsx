import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function VBA() {

    const title = 'Visual Basic for Application';
    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={15} categoryName={title} />
        </div>
    );
}
