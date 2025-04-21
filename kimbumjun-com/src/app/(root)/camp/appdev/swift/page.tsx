import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function SwiftPage() {

    const title = 'Swift';

    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes
                categoryId={26}
                categoryName={title} />
        </div>
    );
}
