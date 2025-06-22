'use client';
import { ReactNode } from 'react';
import VivAppBar from '@/components/VivAppBar';

export default function AppBarLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <VivAppBar>{children}</VivAppBar>
            <div className='w-full min-h-screen'></div>
        </>
    )
}
