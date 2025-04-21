import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function CssScssLessPage() {

    const title = 'CSS / SCSS / LESS';

    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes
                categoryId={40}
                categoryName={title} />
        </div>
    );
}
