import IncrementalCodes from '@/components/IncrementalCodes';
import VivTitle from '@/components/VivTitle';
export default function Page() {
    const title = 'C# Intermediate';
    return (
        <>
            <VivTitle title={title} />
            <IncrementalCodes categoryId={1} categoryName={title} />
        </>
    );
}
