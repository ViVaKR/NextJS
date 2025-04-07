'use client';
import { ReactNode } from 'react';
import VivAppBar from '@/components/VivAppBar';

export default function AppBarLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <VivAppBar>{children}</VivAppBar>
        </div>
    )
}
