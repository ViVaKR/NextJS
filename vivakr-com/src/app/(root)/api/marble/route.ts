import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, set, get, push, update, remove, Database, runTransaction } from 'firebase/database';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { IQuizCell } from '@/interfaces/i-quiz';

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
const quizFilePath = path.join(process.cwd(), 'data', 'questions.json');

const playerChars = [
    { id: 0, name: "vivakr.webp" },
    { id: 1, name: "smile.webp" },
    { id: 2, name: "man.webp" },
    { id: 3, name: "buddha.webp" }
];

async function uploadQuizDataToFirebase(roomId: string) {
    try {
        const jsonData = await fs.readFile(quizFilePath, 'utf-8');
        const quizData: IQuizCell[] = JSON.parse(jsonData);
        if (!quizData || !Array.isArray(quizData)) {
            throw new Error('Invalid quiz data');
        }
        await set(ref(dbInstance, `rooms/${roomId}/quizData`), quizData);
        console.log(`[API Quiz Upload] Uploaded ${quizData.length} quizzes to room ${roomId}`);
    } catch (err) {
        console.error('[API Quiz Upload] Error:', err);
        throw err;
    }
}

function getRandomNumbers(count: number, min: number, max: number): number[] {
    if (min > max) throw new Error('Min cannot exceed max');
    if (count < 0 || min < 0 || max < 0) throw new Error('Count, min, and max must be non-negative');
    const range = max - min + 1;
    if (count > range) throw new Error('Count cannot exceed range (max - min + 1)');

    const numbers = Array.from({ length: range }, (_, i) => i + min);
    for (let i = 0; i < count; i++) {
        const j = Math.floor(Math.random() * (range - i)) + i;
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, count);
}

function getColoredRandomNumbers(max: number): { sky: number[], red: number[] } {
    if (max < 10) throw new Error('Max must be at least 10');
    const numbers = getRandomNumbers(10, 5, max);
    const shuffled = [...numbers];
    for (let i = 0; i < 3; i++) {
        const j = Math.floor(Math.random() * (10 - i)) + i;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return { sky: shuffled.slice(0, 3), red: shuffled.slice(3) };
}

async function initializeRoomData(roomId: string, title: string, creatorId: number) {
    const colorGroup = getColoredRandomNumbers(100);
    const initialData = {
        title,
        creatorId,
        status: 'waiting',
        players: {},
        colorGroup,
        lastRoll: null,
        currentTurn: null
    };
    await set(ref(dbInstance, `rooms/${roomId}`), initialData);
    await uploadQuizDataToFirebase(roomId);
    console.log(`[Server] Initialized room ${roomId}:`, { title, creatorId, colorGroup });
    return initialData;
}

async function resetGameData(roomId: string) {
    const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
    if (!roomSnap.exists()) {
        throw new Error('Room not found');
    }
    const roomData = roomSnap.val();
    const players = roomData.players || {};
    const playerIds = Object.keys(players).map(Number);

    // 현재 플레이어 유지, 상태만 초기화
    const resetPlayers: { [key: number]: any } = {};
    playerIds.forEach(id => {
        resetPlayers[id] = {
            char: players[id].char,
            position: 1,
            joinedAt: players[id].joinedAt,
            lastMoveTimestamp: null
        };
    });

    const colorGroup = getColoredRandomNumbers(100);
    const updates: { [key: string]: any } = {
        [`rooms/${roomId}/players`]: resetPlayers,
        [`rooms/${roomId}/colorGroup`]: colorGroup,
        [`rooms/${roomId}/lastRoll`]: null,
        [`rooms/${roomId}/currentTurn`]: playerIds.sort((a, b) => players[a].joinedAt - players[b].joinedAt)[0],
        [`rooms/${roomId}/status`]: 'playing'
    };

    await update(ref(dbInstance), updates);
    console.log(`[Server] Reset room ${roomId}:`, { players: resetPlayers, colorGroup });
    return { players: resetPlayers, colorGroup };
}

export async function GET() {
    try {
        const roomsSnap = await get(ref(dbInstance, 'rooms'));
        const rooms = roomsSnap.val() || {};
        const roomList = Object.entries(rooms).map(([id, data]: [string, any]) => ({
            id,
            title: data.title,
            creatorId: data.creatorId,
            status: data.status,
            playerCount: Object.keys(data.players || {}).length,
            players: data.players || {}
        }));
        return NextResponse.json({ rooms: roomList }, { status: 200 });
    } catch (err) {
        console.error('[API GET] Error:', err);
        return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, roomId, playerId, title, score } = body;

        if (action === 'createRoom') {
            if (!title || playerId === undefined) {
                return NextResponse.json({ error: 'Title and playerId required' }, { status: 400 });
            }
            const roomRef = push(ref(dbInstance, 'rooms'));
            const newRoomId = roomRef.key!;
            await initializeRoomData(newRoomId, title, playerId);
            console.log(`[API POST] Created room ${newRoomId} by player ${playerId}`);
            return NextResponse.json({ roomId: newRoomId, creatorId: playerId }, { status: 200 });
        }

        if (action === 'joinRoom') {
            if (!roomId || playerId === undefined) {
                return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
            }
            if (!playerChars.some(c => c.id === playerId)) {
                return NextResponse.json({ error: 'Invalid playerId' }, { status: 400 });
            }
            const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
            if (!roomSnap.exists()) {
                return NextResponse.json({ error: `방 번호  ${roomId} 은 존재하지 않습니다.` }, { status: 404 });
            }
            const roomData = roomSnap.val();
            if (roomData.status !== 'waiting') {
                return NextResponse.json({ error: '이미 게임이 시작되었습니다.' }, { status: 400 });
            }
            const players = roomData.players || {};
            if (Object.keys(players).length >= 4) {
                return NextResponse.json({ error: '방 정원 4명 모두 채워졌습니다.' }, { status: 400 });
            }
            if (players[playerId]) {
                return NextResponse.json({ error: '이미 방에 참가 하셨습니다.' }, { status: 400 });
            }
            const selectedChar = playerChars.find(c => c.id === playerId)!.name;
            const updates: any = {
                [`rooms/${roomId}/players/${playerId}`]: {
                    char: selectedChar,
                    position: 1,
                    joinedAt: Date.now()
                }
            };

            if (roomData.creatorId === null) {
                updates[`rooms/${roomId}/creatorId`] = playerId;
            }
            await update(ref(dbInstance), updates);

            return NextResponse.json({
                success: true,
                creatorId: roomData.creatorId || playerId
            },
                { status: 200 });
        }

        if (action === 'resetGame') {
            // 방장 확인
            const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
            if (!roomSnap.exists()) {
                return NextResponse.json({ error: 'Room not found' }, { status: 404 });
            }
            const roomData = roomSnap.val();
            if (playerId !== roomData.creatorId) {
                return NextResponse.json({ error: '방장만 게임을 초기화 할 수 있습니다.' }, { status: 403 });
            }

            // 플레이어 수 확인
            const players = roomData.players || {};
            const playerCount = Object.keys(players).length;
            if (playerCount < 2) {
                return NextResponse.json({ error: `최소 2명이 참여해야 게임 시작이 가능합니다. 현재 ${playerCount}/4명` }, { status: 400 });
            }

            const { players: resetPlayers, colorGroup } = await resetGameData(roomId);
            return NextResponse.json({ players: resetPlayers, colorGroup }, { status: 200 });
        }

        if (action === 'deleteRoom') {
            if (!roomId || playerId === undefined) {
                return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
            }
            const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
            if (!roomSnap.exists()) {
                return NextResponse.json({ error: 'Room not found' }, { status: 404 });
            }
            const roomData = roomSnap.val();
            if (playerId !== roomData.creatorId) {
                return NextResponse.json({ error: 'Only creator can delete room' }, { status: 403 });
            }
            await remove(ref(dbInstance, `rooms/${roomId}`));
            console.log(`[API POST] Deleted room ${roomId} by player ${playerId}`);
            return NextResponse.json({ success: true }, { status: 200 });
        }

        if (action === 'forceDeleteRoom') {
            if (!roomId || playerId === undefined) {
                return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
            }
            const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
            if (!roomSnap.exists()) {
                return NextResponse.json({ error: 'Room not found' }, { status: 404 });
            }
            await remove(ref(dbInstance, `rooms/${roomId}`));
            console.log(`[API POST] Deleted room ${roomId} by player ${playerId}`);
            return NextResponse.json({ success: true }, { status: 200 });
        }

        if (action === 'startGame') {
            if (!roomId || playerId === undefined) {
                return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
            }
            const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
            if (!roomSnap.exists()) {
                return NextResponse.json({ error: 'Room not found' }, { status: 404 });
            }
            const roomData = roomSnap.val();
            if (roomData.creatorId !== playerId) {
                return NextResponse.json({ error: 'Only creator can start game' }, { status: 403 });
            }
            const players = roomData.players || {};
            const playerCount = Object.keys(players).length;
            if (playerCount < 2) {
                return NextResponse.json({ error: `At least 2 players required. Current: ${playerCount}/4` }, { status: 400 });
            }
            const colorGroup = getColoredRandomNumbers(100);
            const playerIds = Object.keys(players).map(Number).sort((a, b) => players[a].joinedAt - players[b].joinedAt);
            await update(ref(dbInstance, `rooms/${roomId}`), {
                status: 'playing',
                colorGroup,
                lastRoll: null,
                currentTurn: playerIds[0]
            });

            return NextResponse.json({ success: true, colorGroup }, { status: 200 });
        }

        if (action === 'rollDice') {
            if (!roomId || playerId === undefined) {
                return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
            }
            const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
            if (!roomSnap.exists()) {
                return NextResponse.json({ error: 'Room not found' }, { status: 404 });
            }
            const roomData = roomSnap.val();
            if (roomData.currentTurn !== playerId) {
                return NextResponse.json({ error: 'Not your turn' }, { status: 403 });
            }
            const diceResult = Math.floor(Math.random() * 6) + 1;
            const diceData = { value: diceResult, timestamp: Date.now(), playerId };
            await set(ref(dbInstance, `rooms/${roomId}/lastRoll`), diceData);
            console.log(`[API POST] rollDice: result=${diceResult}, playerId=${playerId}, roomId=${roomId}`);
            return NextResponse.json({ diceResult, playerId }, { status: 200 });
        }

        if (action === 'moveToken') {
            const { diceValue } = body;
            if (!roomId || playerId === undefined || typeof diceValue !== 'number' || diceValue < 1 || diceValue > 6) {
                return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
            }
            const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
            if (!roomSnap.exists()) {
                return NextResponse.json({ error: 'Room not found' }, { status: 404 });
            }
            const roomData = roomSnap.val();

            const playerRef = ref(dbInstance, `rooms/${roomId}/players/${playerId}`);
            const playerSnap = await get(playerRef);
            const playerData = playerSnap.val() || {};
            const lastMoveTimestamp = playerData.lastMoveTimestamp;

            if (lastMoveTimestamp) {
                const now = Date.now();
                const timeDiff = now - lastMoveTimestamp;

                // 중복 요청 방지 (시간 기준을 좀 더 여유있게 줍니다)
                // 2초 이내의 중복 요청은 무시
                if (timeDiff < 2000) {

                    // 중복 요청 무시 시 현재 상태를 다시 읽어서 반환
                    const playersSnap = await get(ref(dbInstance,
                        `rooms/${roomId}/players`));

                    const players = playersSnap.val() || {};
                    const currentPosition = players[playerId]?.position || 1;
                    return NextResponse.json({ players, newPosition: currentPosition }, { status: 200 });
                }
            }

            const positionRef = ref(dbInstance,
                `rooms/${roomId}/players/${playerId}/position`);
            let finalPosition: number | undefined;

            // 트랜잭션으로 안전하게 위치 업데이트
            const transactionResult = await runTransaction(positionRef, (currentPosition) => {
                if (currentPosition === null || typeof currentPosition !== 'number') currentPosition = 1;
                let newPositionCalc = currentPosition + diceValue;
                newPositionCalc = Math.min(newPositionCalc, 100);
                // 100칸을 넘으면 100에 멈추도록 함 (마블 규칙에 따라 변경 가능)
                // 만약 100을 넘으면 한 바퀴 도는 규칙이라면 newPositionCalc = (currentPosition - 1 + diceValue) % 100 + 1;
                // 여기서는 일단 100에서 멈추도록 유지
                newPositionCalc = Math.max(newPositionCalc, 1);
                finalPosition = newPositionCalc;
                return finalPosition; // 트랜잭션에 최종 위치 반환
            });

            if (!transactionResult.committed || finalPosition === undefined) {
                return NextResponse.json({ error: 'Position update failed' },
                    { status: 500 });
            }

            // 플레이어 위치 및 마지막 이동 타임스탬프 업데이트
            // ** 중요: 여기서 currentTurn 업데이트 로직을 제거합니다. **
            const updates: any = {
                [`rooms/${roomId}/players/${playerId}/position`]: finalPosition,
                [`rooms/${roomId}/players/${playerId}/lastMoveTimestamp`]: Date.now() // 이동 완료 시점 기록
            };

            // 마지막 굴림 정보도 여기서 지워줍니다.
            updates[`rooms/${roomId}/lastRoll`] = null;

            await update(ref(dbInstance), updates);

            console.log(`[API POST] moveToken: Firebase updated for player ${playerId} position and lastMoveTimestamp, lastRoll cleared.`);

            // API 응답에는 업데이트된 players 정보와 새 위치만 포함
            const playersSnap = await get(ref(dbInstance, `rooms/${roomId}/players`));
            const players = playersSnap.val() || {};
            const playerIds = Object.keys(players).map(Number).sort((a, b) => players[a].joinedAt - players[b].joinedAt);
            const currentIndex = playerIds.indexOf(playerId);
            const nextTurn = playerIds[(currentIndex + 1) % playerIds.length];

            return NextResponse.json({ players, newPosition: finalPosition }, { status: 200 });
        }

        if (action === 'submitScore') {
            if (!roomId || playerId === undefined || typeof score !== 'number') {
                return NextResponse.json({ error: 'roomId, playerId, and score required' }, { status: 400 });
            }
            const playerRef = ref(dbInstance, `rooms/${roomId}/players/${playerId}`);
            const playerSnap = await get(playerRef);
            if (!playerSnap.exists()) {
                return NextResponse.json({ error: 'Player not found' }, { status: 404 });
            }
            const currentScore = playerSnap.val().score || 0;
            // Validate score (e.g., max 50 per question)
            if (score < 0 || score > 50) {
                return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
            }
            await update(playerRef, { score: currentScore + score });
            console.log(`[API POST] Updated score for player ${playerId} in room ${roomId}: +${score}`);
            return NextResponse.json({ success: true }, { status: 200 });
        }

        if (action === 'nextTurn') {
            if (!roomId || playerId === undefined) {
                return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
            }
            const roomRef = ref(dbInstance, `rooms/${roomId}`);
            const roomSnap = await get(roomRef);
            if (!roomSnap.exists()) {
                return NextResponse.json({ error: 'Room not found' }, { status: 404 });
            }
            const roomData = roomSnap.val();
            const players = Object.keys(roomData.players || {}).map(Number);
            const currentTurn = roomData.currentTurn;
            const currentIndex = players.indexOf(currentTurn);
            const nextIndex = (currentIndex + 1) % players.length;
            const nextTurn = players[nextIndex];
            await update(roomRef, { currentTurn: nextTurn });
            console.log(`[API POST] Advanced turn in room ${roomId} to player ${nextTurn}`);
            return NextResponse.json({ success: true }, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (err) {
        console.error('[API POST] Error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
