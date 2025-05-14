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

function getRandomNumbers(count: number, max: number): number[] {
    if (count > max) throw new Error('Count cannot exceed max');
    if (count < 0 || max <= 0) throw new Error('Count and max must be positive');
    const numbers = Array.from({ length: max }, (_, i) => i + 1);
    for (let i = 0; i < count; i++) {
        const j = Math.floor(Math.random() * (max - i)) + i;
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, count);
}

function getColoredRandomNumbers(max: number): { sky: number[], red: number[] } {
    if (max < 10) throw new Error('Max must be at least 10');
    const numbers = getRandomNumbers(10, max);
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
        lastRoll: null
    };
    await set(ref(dbInstance, `rooms/${roomId}`), initialData);
    await uploadQuizDataToFirebase(roomId);
    console.log(`[Server] Initialized room ${roomId}:`, { title, colorGroup });
    return initialData;
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
        console.log('[API GET] Returning room list:', roomList);
        return NextResponse.json({ rooms: roomList }, { status: 200 });
    } catch (err) {
        console.error('[API GET] Error:', err);
        return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, roomId, playerId, title } = body;

        if (action === 'createRoom') {
            if (!title) {
                return NextResponse.json({ error: 'Title required' }, { status: 400 });
            }
            const roomRef = push(ref(dbInstance, 'rooms'));
            const newRoomId = roomRef.key!;
            await initializeRoomData(newRoomId, title, playerId);
            console.log(`[API POST] Created room ${newRoomId}`);
            return NextResponse.json({ roomId: newRoomId }, { status: 200 });
        }

        if (action === 'deleteRoom') {
            if (!roomId) {
                return NextResponse.json({ error: 'roomId required' }, { status: 400 });
            }
            const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
            if (!roomSnap.exists()) {
                return NextResponse.json({ error: 'Room not found' }, { status: 404 });
            }
            // 추후 권한 체크 추가 가능
            // const roomData = roomSnap.val();
            // if (playerId !== roomData.creatorId) {
            //     return NextResponse.json({ error: 'Only creator can delete room' }, { status: 403 });
            // }
            await remove(ref(dbInstance, `rooms/${roomId}`));
            console.log(`[API POST] Deleted room ${roomId}`);
            return NextResponse.json({ success: true }, { status: 200 });
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
                return NextResponse.json({ error: 'Room not found' }, { status: 404 });
            }
            const roomData = roomSnap.val();
            if (roomData.status !== 'waiting') {
                return NextResponse.json({ error: 'Game already started' }, { status: 400 });
            }
            const players = roomData.players || {};
            if (Object.keys(players).length >= 4) {
                return NextResponse.json({ error: 'Room is full' }, { status: 400 });
            }
            if (players[playerId]) {
                return NextResponse.json({ error: 'Already joined' }, { status: 400 });
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
            // 방장이 없는 경우 첫 입장자를 방장으로 설정
            if (roomData.createId === null) {
                updates[`rooms/${roomId}/creatorId`] = playerId;
            }
            await update(ref(dbInstance), updates);
            console.log(`[API POST] Player ${playerId} joined room ${roomId}`);
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
            await update(ref(dbInstance, `rooms/${roomId}`), {
                status: 'playing',
                colorGroup,
                lastRoll: null
            });
            console.log(`[API POST] Started game in room ${roomId}:`, { colorGroup });
            return NextResponse.json({ success: true, colorGroup }, { status: 200 });
        }

        if (action === 'rollDice') {
            if (!roomId || playerId === undefined) {
                return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
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
            const playerRef = ref(dbInstance, `rooms/${roomId}/players/${playerId}`);
            const playerSnap = await get(playerRef);
            const playerData = playerSnap.val() || {};
            const lastMoveTimestamp = playerData.lastMoveTimestamp;

            if (lastMoveTimestamp) {
                const now = Date.now();
                const timeDiff = now - lastMoveTimestamp;
                if (timeDiff < 1000) {
                    console.log(`[API POST] moveToken: Duplicate request, playerId=${playerId}, timeDiff=${timeDiff}ms`);
                    const playersSnap = await get(ref(dbInstance, `rooms/${roomId}/players`));
                    const players = playersSnap.val() || {};
                    const currentPosition = players[playerId]?.position || 1;
                    return NextResponse.json({ players, newPosition: currentPosition }, { status: 200 });
                }
            }

            const positionRef = ref(dbInstance, `rooms/${roomId}/players/${playerId}/position`);
            let finalPosition: number | undefined;
            const transactionResult = await runTransaction(positionRef, (currentPosition) => {
                if (currentPosition === null || typeof currentPosition !== 'number') currentPosition = 1;
                let newPositionCalc = currentPosition + diceValue;
                newPositionCalc = Math.min(newPositionCalc, 100);
                newPositionCalc = Math.max(newPositionCalc, 1);
                finalPosition = newPositionCalc;
                return finalPosition;
            });

            if (!transactionResult.committed || finalPosition === undefined) {
                console.error(`[API POST] moveToken: Transaction failed, playerId=${playerId}`);
                return NextResponse.json({ error: 'Position update failed' }, { status: 500 });
            }

            await update(ref(dbInstance, `rooms/${roomId}/players/${playerId}`), {
                lastMoveTimestamp: Date.now()
            });
            await set(ref(dbInstance, `rooms/${roomId}/lastRoll`), null);
            const playersSnap = await get(ref(dbInstance, `rooms/${roomId}/players`));
            const players = playersSnap.val() || {};
            console.log(`[API POST] Player ${playerId} moved to position ${finalPosition} in room ${roomId}`);
            return NextResponse.json({ players, newPosition: finalPosition }, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (err) {
        console.error('[API POST] Error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
