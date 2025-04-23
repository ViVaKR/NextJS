'use client'

import VivTitle from '@/components/VivTitle';
import IncrementalCodes from '@/components/IncrementalCodes';

export default function CsAdvancedPage() {

    const title = 'C# Advanced';
    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes
                categoryId={3}
                categoryName={title} />
        </div>
    );

}
