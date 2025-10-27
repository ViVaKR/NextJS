export interface IQuiz {
    text: string;
    choices: string[];
    answer: string;
    baseScore?: number;
    dificulty?: 'easy' | 'medium' | 'hard'; // 미래전환 준비
}

export interface IQuizCell {
    cell: number;
    main: IQuiz;
    reserve: IQuiz[]
}



/*
점수:
주사위 1: 10 × 1 + 5 = 15점.
주사위 6: min(10 × 6, 50) = 50점.
Firebase players/{playerId}/score 업데이트 확인.

*/
