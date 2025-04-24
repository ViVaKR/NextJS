'use client'
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export default function UpdateButton({ codeId, userId }: { codeId: number, userId: string }) {
    const [canEdit, loading] = useAuthCheck(userId);

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography>수정 권한 확인 중...</Typography>
            </Box>
        );
    }
    if (!canEdit) return null;
    return (
        <div>
            <Link
                href={`/code/update/${codeId}`}
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
