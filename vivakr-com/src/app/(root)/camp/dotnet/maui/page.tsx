import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function MauiPage() {

    const title = '.NET MAUI'
    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={8} categoryName={title} />
        </div>
    );
}
