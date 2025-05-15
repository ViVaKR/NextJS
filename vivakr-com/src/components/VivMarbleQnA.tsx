'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { get, ref } from 'firebase/database';
import { db } from '@/lib/firebase/clientApp';

interface VivMarbleQnAProps {
    qna: number;
    open: boolean;
    onClose: () => void;
    roomId: string;
}

interface QuizData {
    cell: number;
    main: {
        text: string;
        answer: string;
        choices: string[];
    };
}

export default function VivMarbleQnA({ qna, open, onClose, roomId }: VivMarbleQnAProps) {
    const [question, setQuestion] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!open || !qna || qna < 1 || qna > 100) {
            setQuestion('');
            setError('');
            return;
        }

        const fetchQuestion = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const quizRef = ref(db, `rooms/${roomId}/quizData`);
                const snapshot = await get(quizRef);

                if (snapshot.exists()) {
                    const quizData: QuizData[] = snapshot.val();
                    const questionData = quizData.find((item) => item.cell === qna);
                    if (questionData && questionData.main.text) {
                        setQuestion(questionData.main.text);
                    } else {
                        setError(`문제 ${qna}번은 준비중입니다. .`)
                    }
                } else {
                    setError('퀴즈 데이터를 불러올 수 없습니다.');
                }

            } catch (err) {
                console.error('[VivMarbleQnA] Error fetching question:', err);
                setError('문제를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchQuestion();
    }, [open, qna, roomId])

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const answer = formJson.email;
                            onClose();
                        },
                    },
                }}
            >
                <DialogTitle>{qna} 문제</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {isLoading && '문제를 불러오는 중...'}
                        {error && <span className='text-red-500'>{error}</span>}

                        {!isLoading && !error && question ? (
                            <>
                                ( {qna} )
                                {question}
                            </>
                        ) : null}
                        ( {qna} )
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="email"
                        label="정답 입력"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>모름</Button>
                    <Button type="submit">정답제출</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
