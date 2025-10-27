import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import type { IQuizCell, IQuiz } from '@/interfaces/i-quiz';

// JSON 파일 경로 (프로젝트 루트 기준)
const quizFile = path.join(process.cwd(), 'data', 'questions.json');

async function checkFileExists(filePath: string) {
    try {
        await fs.access(filePath, fs.constants.F_OK);
        const readData = fs.readFile(filePath, { encoding: 'utf-8' });
        return readData;
    } catch (err: any) {
        throw err;
    }
}

export async function GET() {

    try {
        const jsonData = await checkFileExists(quizFile);

        const quizzes: IQuizCell[] = JSON.parse(jsonData);
        return NextResponse.json({ data: quizzes }, {
            status: 200
        })
    } catch (err: any) {
        console.error('Failed to read or parse quiz data:', err);
        if (err.code === 'ENOENT') {
            return NextResponse.json(
                { message: '퀴즈 파일을 찾을 수 없습니다.' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { message: '퀴즈 데이터를 불러오는데 실패했습니다.' },
            { status: 500 }
        );
    }
}
