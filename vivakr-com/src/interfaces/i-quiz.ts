export interface IQuiz {
    text: string;
    choices: string[];
    answer: string;
}

export interface IQuizCell {
    cell: number;
    main: IQuiz;
    reserve: IQuiz[]
}
