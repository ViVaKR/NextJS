import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function WpfPage() {

    const title = 'WPF'
    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={6} categoryName={title} />
        </div>
    );
}
