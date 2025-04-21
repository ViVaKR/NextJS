import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function WinUIPage() {

    const title = 'WinUI';

    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={9} categoryName={title} />
        </div>
    );
}
