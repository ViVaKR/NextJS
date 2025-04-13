'use client'
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { getToken } from '@/services/auth.service';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export default function UpdateButton({ codeId, userId }: { codeId: number, userId: string }) {
    const [canDelete, loading] = useAuthCheck(userId);
    if (loading) <span>Loading...</span>
    if (!canDelete) return null;
    return (
        <div>
            <Link href={`/code/update/${codeId}`}
                className="px-8
                py-2
                bg-sky-500
                text-white rounded-full
                hover:bg-sky-600"
            >
                수정
            </Link>
        </div>
    );
}
