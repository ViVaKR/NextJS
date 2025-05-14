import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
    getDatabase, ref, set, get,
    runTransaction,
    serverTimestamp,
    Database,
} from 'firebase/database';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { IQuizCell } from '@/interfaces/i-quiz';
import { getColoredRandomNumbers } from '@/lib/getRandomNumbers';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let appInstance: FirebaseApp;
let dbInstance: Database;

appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
dbInstance = getDatabase(appInstance);
const gameId = 'BlueMarble';
const quizFilePath = path.join(process.cwd(), 'data', 'questions.json');
const playerChars = [
    { id: 0, name: "vivakr.webp" },
    { id: 1, name: "smile.webp" },
    { id: 2, name: "man.webp" },
    { id: 3, name: "buddha.webp" }
];

async function uploadQuizDataToFirebase() {
    try {
        const jsonData = await fs.readFile(quizFilePath, 'utf-8');
        const quizDataFromFile: IQuizCell[] = JSON.parse(jsonData);
        if (!quizDataFromFile || !Array.isArray(quizDataFromFile)) {
            throw new Error('JSON 파일에서 유효한 퀴즈 데이터를 찾을 수 없습니다. "data" 배열이 필요합니다.');
        }
        const quizzesToUpload = quizDataFromFile;
        await set(ref(dbInstance, `games/${gameId}/quizData`), quizzesToUpload);
        console.log(`[API Quiz Upload] 퀴즈 데이터 ${quizzesToUpload.length}개 업로드 완료`);
    } catch (err: any) {
        console.error('[API Quiz Upload] 퀴즈 데이터 업로드 중 오류:', err);
        throw err;
    }
}

// function getRandomNumbers(count: number, max: number): number[] {
//     if (count > max) {
//         throw new Error('count는 max보다 클 수 없습니다.');
//     }
//     if (count < 0 || max <= 0) {
//         throw new Error('count와 max는 양수여야 합니다.');
//     }
//     const numbers: number[] = Array.from({ length: max }, (_, i) => i + 1);
//     for (let i = 0; i < count; i++) {
//         const j = Math.floor(Math.random() * (max - i)) + i;
//         [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
//     }
//     return numbers.slice(0, count);
// }

// function getColoredRandomNumbers(max: number): { sky: number[], red: number[] } {
//     if (max < 10) {
//         throw new Error('max는 10 이상이어야 합니다.');
//     }
//     const numbers = getRandomNumbers(10, max);
//     console.log('[Server] Selected 10 numbers:', numbers);
//     const shuffled = [...numbers];
//     for (let i = 0; i < 3; i++) {
//         const j = Math.floor(Math.random() * (10 - i)) + i;
//         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     const sky = shuffled.slice(0, 3);
//     const red = shuffled.slice(3);
//     return { sky, red };
// }

async function initializeGameData() {
    const initialPlayersData: { [key: number]: any } = {};
    playerChars.forEach(player => {
        initialPlayersData[player.id] = {
            char: player.name,
            position: 1,
            lastDice: null,
            lastMoveTimestamp: null
        };
    });
    const colorGroup = getColoredRandomNumbers(100);
    await set(ref(dbInstance, `games/${gameId}/players`),
        initialPlayersData);

    await set(ref(dbInstance, `games/${gameId}/lastRoll`),
        null);

    await set(ref(dbInstance, `games/${gameId}/colorGroup`), colorGroup);

    return { players: initialPlayersData, colorGroup };
}

export async function GET() {
    try {
        const initialPlayers = await initializeGameData();
        await uploadQuizDataToFirebase();
        return NextResponse.json({
            players: initialPlayers
        }, { status: 200 });
    } catch (err) {
        console.error('[API GET - Reset Logic] 오류:', err);
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 초기화 오류';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, playerId, diceValue } = body;

        if (action === 'resetGame') {

            // 방장 확인 (playerId: 0)
            if (playerId !== 0) {
                return NextResponse.json({
                    error: '방장만 게임을 초기화 할 수 있습니다.'
                }, { status: 403 });
            }

            // 플레이어 수 확인
            const playersSnap = await get(ref(dbInstance,
                `games/${gameId}/players`
            ));

            const players = playersSnap.val() || {};
            const playersCount = Object.keys(players).length;

            if (playersCount < 2) {
                return NextResponse.json({ error: `최소 2명이 참여해야 게임 시작이 가능합니다. 현재 ${playersCount}/4명`, status: 400 });
            }


            const { players: resetPlayers, colorGroup } = await initializeGameData();

            return NextResponse.json({ players: resetPlayers, colorGroup },
                { status: 200 });
        }

        if (action !== 'resetGame' && (playerId === undefined || playerId === null || !playerChars.some(p => p.id === playerId))) {
            console.error('[API POST] 잘못된 playerId:', playerId);
            return NextResponse.json({ error: '유효하지 않은 플레이어 ID' }, { status: 400 });
        }

        if (action === 'rollDice') {
            console.log(`[API POST] rollDice 요청: playerId=${playerId}`);
            const diceResult = Math.floor(Math.random() * 6) + 1;
            const diceData = { value: diceResult, timestamp: serverTimestamp(), playerId };
            await set(ref(dbInstance, `games/${gameId}/lastRoll`), diceData);
            console.log(`[API POST] rollDice 완료: diceResult=${diceResult}, playerId=${playerId}`);
            return NextResponse.json({
                diceResult,
                playerId
            }, { status: 200 });
        }

        if (action === 'moveToken') {
            if (typeof diceValue !== 'number' || diceValue < 1 || diceValue > 6) {
                return NextResponse.json({ error: '유효하지 않은 주사위 값' }, { status: 400 });
            }

            // 중복 이동 방지: 마지막 이동 타임스탬프 확인
            const playerRef = ref(dbInstance,
                `games/${gameId}/players/${playerId}`);
            const playerSnap = await get(playerRef);
            const playerData = playerSnap.val() || {};
            const lastMoveTimestamp = playerData.lastMoveTimestamp;

            if (lastMoveTimestamp) {
                const now = Date.now();
                const timeDiff = now - lastMoveTimestamp;
                if (timeDiff < 1000) { // 1초 이내 동일 요청 무시
                    console.log(`[API POST] moveToken: 중복 요청 감지, playerId=${playerId}, diceValue=${diceValue}, timeDiff=${timeDiff}ms`);
                    const playersSnap = await get(ref(dbInstance, `games/${gameId}/players`));
                    const players = playersSnap.val() || {};
                    const currentPosition = players[playerId]?.position || 1;
                    return NextResponse.json({ players, newPosition: currentPosition }, { status: 200 });
                }
            }

            const positionRef = ref(dbInstance, `games/${gameId}/players/${playerId}/position`);
            let finalPosition: number | undefined;

            const transactionResult = await runTransaction(positionRef, (currentPosition) => {
                if (currentPosition === null || typeof currentPosition !== 'number') { currentPosition = 1; }
                let newPositionCalc = currentPosition + diceValue;
                newPositionCalc = Math.min(newPositionCalc, 100);
                newPositionCalc = Math.max(newPositionCalc, 1);
                finalPosition = newPositionCalc;
                return finalPosition;
            });

            if (!transactionResult.committed || finalPosition === undefined) {
                console.error(`[API POST] moveToken: 트랜잭션 실패, playerId=${playerId}, diceValue=${diceValue}`);
                return NextResponse.json({ error: '위치 업데이트 실패' }, { status: 500 });
            }

            // 마지막 이동 타임스탬프 업데이트
            await set(ref(dbInstance, `games/${gameId}/players/${playerId}/lastMoveTimestamp`), Date.now());
            await set(ref(dbInstance, `games/${gameId}/lastRoll`), null);
            const playersSnap = await get(ref(dbInstance, `games/${gameId}/players`));
            const players = playersSnap.val() || {};
            console.log(`[API POST] Player ${playerId} 최종 위치 (${finalPosition}) 업데이트 완료. lastRoll 초기화.`);
            return NextResponse.json({ players, newPosition: finalPosition }, { status: 200 });
        }

        console.warn('[API POST] 잘못된 액션 요청:', action);
        return NextResponse.json({ error: '잘못된 액션 요청' }, { status: 400 });
    } catch (err) {
        console.error('[API POST] 처리 중 오류:', err);
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 서버 오류';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

