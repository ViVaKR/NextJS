'use client'

import VivTitle from '@/components/VivTitle';
import IncrementalCodes from '@/components/IncrementalCodes';

export default function Page() {

    const title = 'C# Advanced';
    return (
        <div className='mx-2'>
            <VivTitle title={title} />
            <IncrementalCodes
                categoryId={35}
                categoryName={title} />
        </div>
    );

}
