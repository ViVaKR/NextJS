import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';

export default function PythonPage() {

    const title = 'PHP';

    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes
                categoryId={34}
                categoryName={title} />
        </div>
    );

}
