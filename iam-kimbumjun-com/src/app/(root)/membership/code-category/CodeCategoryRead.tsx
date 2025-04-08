import React from 'react';
const CategoryRead = ({
    id, name
}: {
    id?: number;
    name?: string;
}) => {
    if (!id && !name) return null; // 데이터 없으면 렌더링 안 함
    return (
        <React.Fragment>
            {/*  */}
            <ul className='flex gap-4 w-full h-auto py-2 px-4 rounded-md mb-4 bg-slate-300'>
                <li>{id}</li>
                <li>{name}</li>
            </ul>
        </React.Fragment>
    );
}
export default CategoryRead;
