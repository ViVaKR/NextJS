'use client'
import { useSnackbar } from '@/lib/SnackbarContext';
import { Button, Tooltip } from '@mui/material';
import { title } from 'process';
import { useState } from 'react';

interface CopyClipboardProps {
    content: string | object; // string 또는 객체를 받을 수 있도록
    title?: string
}

export default function CopyClipboard({
    content,
    title
}: CopyClipboardProps) {

    const snackbar = useSnackbar();

    const [copySuccess, setCopySuccess] = useState(false); // 복사 성공 여부 상태

    const handleCopyToClipboard = async (data: string | object) => {
        try {
            const textToCopy = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            await navigator.clipboard.writeText(textToCopy);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
            snackbar.showSnackbar(`${title} 복사완료!`);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopySuccess(false);
            snackbar.showSnackbar(`${title} 복사실패!`);
        }
    };

    return (
        <Button
            className="cursor-pointer hover:text-red-400 text-slate-400 shrink"
            onClick={() => handleCopyToClipboard(content)}
        >
            <Tooltip enterDelay={500} leaveDelay={200} title={copySuccess ? `${title} 복사완료!` : `${title} 복사하기?`} arrow>
                <span className="material-symbols-outlined" aria-label={copySuccess ? `${title} 복사완료!` : `${title} 복사하기?`} style={{ fontSize: '1.2rem' }}>
                    content_copy
                </span>
            </Tooltip>
        </Button>
    );

}
