import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, get, runTransaction, serverTimestamp } from 'firebase/database';
import { NextResponse } from 'next/server';

// Firebase 설정 (환경 변수 사용 권장)
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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const gameId = 'BlueMarble';

const playerChars = [
    { id: 0, name: "믿어핑.jpg" },
    { id: 1, name: "방글핑.jpg" },
    { id: 2, name: "패션핑.jpg" },
    { id: 3, name: "하츄핑.jpg" }
];

// --- 게임 초기화 로직을 별도 함수로 분리 (코드 중복 방지) ---
async function initializeGameData() {
    console.log('[API] 게임 데이터 초기화 실행...');
    const initialPlayersData: { [key: number]: any } = {};
    playerChars.forEach(player => {
        initialPlayersData[player.id] = {
            char: player.name,
            position: 1, // 항상 1로 시작
            lastDice: null
        };
    });
    // Firebase에 초기 데이터 쓰기 (덮어쓰기)
    await set(ref(db, `games/${gameId}/players`), initialPlayersData);
    console.log('[API] 게임 데이터 초기화 완료.');
    return initialPlayersData; // 초기화된 데이터 반환
}

// GET 요청: 항상 게임을 초기화하고 초기 상태 반환 (새로고침 시 리셋)
export async function GET() {
    try {
        // GET 요청 시 무조건 게임 데이터 초기화 실행
        const initialPlayers = await initializeGameData();
        return NextResponse.json({ players: initialPlayers }, { status: 200 });
    } catch (err) {
        console.error('[API GET - Reset Logic] 오류:', err);
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 초기화 오류';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// POST 요청: 주사위 굴리기, 말 이동, 게임 리셋 처리
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, playerId, diceValue } = body;

        // --- 게임 리셋 액션 ---
        if (action === 'resetGame') {
            console.log(`[API POST] resetGame 요청`);
            // 게임 초기화 함수 호출
            const resetPlayers = await initializeGameData();
            // 초기화된 데이터 반환
            return NextResponse.json({ players: resetPlayers }, { status: 200 });
        }

        // --- 이하 기존 rollDice, moveToken 로직 ---

        // playerId 유효성 검사 (resetGame 외의 액션에만 필요)
        if (action !== 'resetGame' && (playerId === undefined || playerId === null || !playerChars.some(p => p.id === playerId))) {
            console.error('[API POST] 잘못된 playerId:', playerId);
            return NextResponse.json({ error: '유효하지 않은 플레이어 ID' }, { status: 400 });
        }

        // --- 주사위 굴리기 액션 ---
        if (action === 'rollDice') {
            console.log(`[API POST] rollDice 요청 (Player ${playerId})`);
            const diceResult = Math.floor(Math.random() * 6) + 1;
            const diceData = { value: diceResult, timestamp: serverTimestamp() };
            await set(ref(db, `games/${gameId}/players/${playerId}/lastDice`), diceData);
            console.log(`[API POST] Player ${playerId} 주사위 결과 (${diceResult}) 저장 완료`);
            return NextResponse.json({ diceResult }, { status: 200 });
        }

        // --- 말 이동 액션 ---
        if (action === 'moveToken') {
            if (typeof diceValue !== 'number' || diceValue < 1 || diceValue > 6) {
                console.error('[API POST] 잘못된 diceValue:', diceValue);
                return NextResponse.json({ error: '유효하지 않은 주사위 값' }, { status: 400 });
            }
            console.log(`[API POST] moveToken 요청 (Player ${playerId}, Dice: ${diceValue})`);
            const positionRef = ref(db, `games/${gameId}/players/${playerId}/position`);
            let finalPosition: number | undefined;

            const transactionResult = await runTransaction(positionRef, (currentPosition) => {
                if (currentPosition === null || typeof currentPosition !== 'number') {
                    currentPosition = 1;
                }
                let newPositionCalc = currentPosition + diceValue;
                newPositionCalc = Math.min(newPositionCalc, 100);
                newPositionCalc = Math.max(newPositionCalc, 1);
                finalPosition = newPositionCalc;
                console.log(`[API MoveToken TX] Player ${playerId}: ${currentPosition} + ${diceValue} -> ${finalPosition}`);
                return finalPosition;
            });

            if (!transactionResult.committed || finalPosition === undefined) {
                console.error(`[API POST] Player ${playerId} 위치 업데이트 트랜잭션 실패`);
                return NextResponse.json({ error: '위치 업데이트 실패' }, { status: 500 });
            }
            await set(ref(db, `games/${gameId}/players/${playerId}/lastDice`), null);
            const playersSnap = await get(ref(db, `games/${gameId}/players`));
            const players = playersSnap.val() || {};
            console.log(`[API POST] Player ${playerId} 최종 위치 (${finalPosition}) 업데이트 완료. 전체 데이터 반환.`);
            return NextResponse.json({ players, newPosition: finalPosition }, { status: 200 });
        }

        // 정의되지 않은 액션
        console.warn('[API POST] 잘못된 액션 요청:', action);
        return NextResponse.json({ error: '잘못된 액션 요청' }, { status: 400 });

    } catch (err) {
        console.error('[API POST] 처리 중 오류:', err);
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 서버 오류';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
