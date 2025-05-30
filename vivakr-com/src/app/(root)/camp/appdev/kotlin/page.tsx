import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function KotlinPage() {

    const title = 'kotlin';

    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes
                categoryId={32}
                categoryName={title} />
        </div>
    );
}
