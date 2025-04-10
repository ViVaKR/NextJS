import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function SvgPage() {
    const title = 'TailwindCSS';

    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes
                categoryId={45}
                categoryName={title} />
        </div>
    );
}
