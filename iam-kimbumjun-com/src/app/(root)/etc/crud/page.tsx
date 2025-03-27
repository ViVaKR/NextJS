import VivCRUD from '@/components/VivCRUD';
import VivTitle from '@/components/VivTitle';
import { Suspense } from 'react';
export default function CrudPage() {

    return (
        <Suspense>
            <VivCRUD />
        </Suspense>
    );
}
