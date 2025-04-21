import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function VBA() {

    const title = 'Visual Basic for Application (VBA)';
    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={13}
                categoryName={title} />
        </div>
    );
}
