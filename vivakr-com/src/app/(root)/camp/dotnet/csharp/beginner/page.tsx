import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function CsBeginnerPage() {

    const title = 'C# Beginner';

    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes
                categoryId={1}
                categoryName={title} />
        </div>
    );
}
