import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function HtmlPage() {

    const title = 'HTML';

    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes
                categoryId={39}
                categoryName={title} />
        </div>
    );
}
