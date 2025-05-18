'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
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
    diceValue: number;
    playerId: number;
    onSubmitScore: (playerId: number, score: number, qna: number) => void;
    colorGroup: { sky: number[]; red: number[] } | null;
    solvedQuestions: number[];
}

interface IQuiz {
    text: string;
    choices: string[];
    answer: string;
}

interface IQuizCell {
    cell: number;
    main: IQuiz;
    reserve: IQuiz[];
}

export default function VivMarbleQnA({
    qna,
    open,
    onClose,
    roomId,
    diceValue,
    playerId,
    onSubmitScore,
    colorGroup,
    solvedQuestions,
}: VivMarbleQnAProps) {
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [choices, setChoices] = useState<string[]>([]);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const answerInputRef = useRef<HTMLInputElement>(null);


    const BASE_SCORE_NORMAL = 10; // 무색 칸 기본 점수
    const BASE_SCORE_RED = 5;     // 빨간색 칸 기본 점수 (수정)
    const BASE_SCORE_SKY = 15;    // 푸른색 칸 기본 점수 (수정)

    const MAX_SCORE = 50;
    const LOW_DICE_BONUS = 5;
    const isRedCell = colorGroup?.red?.includes(qna); // 빨간색 칸인지 확인
    const isSkyCell = colorGroup?.sky?.includes(qna); // 푸른색 칸인지 확인

    useEffect(() => {
        if (!open || !qna || qna < 1 || qna > 99) {
            setQuestion('');
            setAnswer('');
            setChoices([]);
            setUserAnswer('');
            setError(null);
            return;
        }

        const fetchQuestion = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const quizRef = ref(db, `rooms/${roomId}/quizData`);
                const snapshot = await get(quizRef);

                if (snapshot.exists()) {
                    const quizData: IQuizCell[] = snapshot.val();
                    const questionData = quizData.find((item) => item.cell === qna);

                    if (questionData) {

                        // 1. main 문제와 reserve 문제들을 모두 모음
                        const allQuestionsForCell: IQuiz[] = [questionData.main, ...(questionData.reserve || [])]; // reserve가 null일 경우 대비

                        // 2. 유효한 문제만 필터링 (text와 answer가 비어있지 않은 것)
                        const validQuestions = allQuestionsForCell.filter(q =>
                            q && q.text && q.text.trim() !== '' && q.answer && q.answer.trim() !== ''
                        );

                        // 3. text가 같은 중복 문제 제거
                        const uniqueValidQuestions = validQuestions.filter(
                            (q, index, self) =>
                                index === self.findIndex((t) => t.text === q.text)
                        );


                        if (uniqueValidQuestions.length > 0) {
                            // 4. 유효하고 중복 없는 문제 목록 중에서 랜덤하게 하나 선택
                            const randomIndex = Math.floor(Math.random() * uniqueValidQuestions.length);
                            const selectedQuestion = uniqueValidQuestions[randomIndex];

                            setQuestion(selectedQuestion.text);
                            setAnswer(selectedQuestion.answer);
                            setChoices(selectedQuestion.choices || []); // choices가 없을 경우 빈 배열
                            setUserAnswer(''); // 새로운 문제를 불러왔으니 사용자 입력 초기화

                        } else {
                            setError(`문제 ${qna}번에 유효한 문제가 없습니다.`);
                            setQuestion(''); // 유효한 문제가 없으면 문제/정답 초기화
                            setAnswer('');
                            setChoices([]);
                        }

                    } else {
                        setError(`문제 ${qna}번 데이터를 찾을 수 없습니다.`);
                        setQuestion(''); // 문제 데이터 없으면 문제/정답 초기화
                        setAnswer('');
                        setChoices([]);
                    }
                } else {
                    setError('퀴즈 데이터를 불러올 수 없습니다.');
                    setQuestion(''); // 퀴즈 데이터 없으면 문제/정답 초기화
                    setAnswer('');
                    setChoices([]);
                }
            } catch (err) {
                setError('문제를 불러오는 중 오류가 발생했습니다.');
                setAnswer('');
                setChoices([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestion();
    }, [open, qna, roomId]);

    useEffect(() => {
        if (open && answerInputRef.current) {
            setTimeout(() => {
                if (choices.length === 0)
                    answerInputRef.current?.focus();
            }, 100);
        }
    }, [choices, open]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        let score = 0;

        // ** 수정된 기본 점수 설정 로직 **
        let baseScore = BASE_SCORE_NORMAL; // 기본값은 무색 칸 점수
        if (isRedCell) {
            baseScore = BASE_SCORE_RED; // 빨간색 칸이면 5점
        } else if (isSkyCell) {
            baseScore = BASE_SCORE_SKY; // 푸른색 칸이면 15점
        }

        // *** 정답 확인 및 점수 계산 ***
        const isCorrect = userAnswer.trim().toLowerCase() === answer.toLowerCase();

        // *** 정답 확인 ***
        if (isCorrect) {
            // 1. 기본 점수 * 주사위 값 계산
            const calculatedScore = baseScore * diceValue;

            // 2. 계산된 점수와 최대 점수 (50) 중 작은 값을 적용
            score = Math.min(calculatedScore, MAX_SCORE);

            // 3. 주사위 값이 1 또는 2이면 보너스 점수 추가
            if (diceValue <= 2) {
                score += LOW_DICE_BONUS;
            }

            // 4. 보너스 점수 추가 후 최종 점수가 50을 넘지 않도록 다시 한번 제한
            score = Math.min(score, MAX_SCORE);

        } // 오답이거나 '모름' 선택 시 score는 0으로 유지됨

        onSubmitScore(playerId, score, qna);
        setUserAnswer('');
        onClose(); // 다이얼 로그 닫기
    };

    return (
        <Dialog
            open={open} // esc 나 외부 클릭으로 닫힐 때 호출될 함때

            onClose={onClose}
            disableScrollLock
            slotProps={{
                paper: {
                    component: 'form', // 다이얼 로그 내용을 form 으로 사용하여 submit 이벤트 처리
                    onSubmit: handleSubmit,
                },
            }}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {qna}번 문제 {isRedCell ? '(벌점 -5점)' : isSkyCell ? '(보너스 점수 +5점)' : ''}
            </DialogTitle>
            <DialogContent dividers>
                <DialogContent>
                    <DialogContentText>
                        {isLoading && '문제를 불러오는 중...'}
                        {error && <span className="text-red-500">{error}</span>}
                        {!isLoading && !error && question ? (
                            <>
                                ({qna}) {question}
                            </>
                        ) : null}
                    </DialogContentText>
                    <div className='mt-4'></div>
                    {choices.length > 0 ? (
                        <RadioGroup
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            name="answer"
                        >
                            {choices.map((choice, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={choice}
                                    control={<Radio />}
                                    label={choice}
                                />
                            ))}
                        </RadioGroup>
                    ) : (
                        <TextField
                            margin="dense"
                            id="answer"
                            name="answer"
                            label="정답 입력"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            inputRef={answerInputRef}
                        />
                    )}
                </DialogContent>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setUserAnswer('');
                        onSubmitScore(playerId, 0, qna);
                        onClose();
                        document.getElementById('board')?.focus();
                    }}
                >
                    모름
                </Button>
                <Button type="submit">정답제출</Button>
            </DialogActions>
        </Dialog>
    );
}
