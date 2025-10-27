'use client'
import * as React from 'react';
import { useDialogs, DialogProps } from '@toolpad/core/useDialogs';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import DialogContentText from '@mui/material/DialogContentText';

// 페이로드 타입 정의
interface DialogPayload {
    title?: string;
    contentText?: string;
}

interface VivDialogResultProps extends DialogPayload {
    onResult?: (result: string | null) => void; // 콜백 props 추가
}

function VivDialogView({ open, onClose, payload }: DialogProps<DialogPayload, string | null>) {
    const [result, setResult] = React.useState('');
    // payload에서 title과 contentText 추출, 기본값 설정
    const { title = "Dialog with payload", contentText = "What is your name?" } = payload || {};

    return (
        <Dialog fullWidth open={open} onClose={() => onClose(null)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{contentText}</DialogContentText>
                <TextField
                    label="Name"
                    fullWidth
                    value={result}
                    onChange={(event) => setResult(event.currentTarget.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(result)}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export function VivDialogResult({ title, contentText, onResult }: VivDialogResultProps) {
    const dialogs = useDialogs();
    return (
        <Stack spacing={2}>
            <Button
                onClick={async () => {
                    const result = await dialogs.open(VivDialogView, {
                        title: title,
                        contentText: contentText
                    });
                    await dialogs.alert(`Your name is "${result}"`);

                    if (onResult) onResult(result);
                }}
            >
                Open
            </Button>
        </Stack>
    );
}
