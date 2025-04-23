import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function VisualbasicPage() {
    const title = "Visual Basic .NET"
    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={12} categoryName={title} />
        </div>
    );
}
