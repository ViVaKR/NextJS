import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function WinformsPage() {

    const title = 'Windows Forms';

    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={7} categoryName={title} />
        </div>
    );
}
