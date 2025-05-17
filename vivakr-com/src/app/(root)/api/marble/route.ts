// *** 버전 수정 ***
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, set, get, push, update, remove, Database, runTransaction } from 'firebase/database';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import type { IQuizCell } from '@/interfaces/i-quiz';
import { IMarbleChar } from '@/interfaces/i-player-char';
import { marbleChars } from '@/data/avata-marble';
import { ApiError } from '@/classes/api-error';

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

appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let dbInstance: Database;
dbInstance = getDatabase(appInstance);

const quizFilePath = path.join(process.cwd(), 'data', 'questions.json');

const playerChars: IMarbleChar[] = marbleChars;

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
    console.log(`[Server] 방 초기화 ${roomId}:`, { title, creatorId, colorGroup });
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

    const resetPlayers: { [key: number]: any } = {};
    playerIds.forEach(id => {
        const charData = playerChars.find(x => x.id === id);
        resetPlayers[id] = {
            char: charData?.name || players[id].char,
            avata: charData?.avata || players[id].avata, // 아바타 필드 추가
            position: 1,
            joinedAt: players[id].joinedAt,
            lastMoveTimestamp: null,
            score: 0 // 점수 초기화 추가
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
        const { action, roomId, playerId, title, score, diceValue } = body;

        if (!action) {
            return NextResponse.json({ error: 'Action required' }, { status: 400 });
        }

        switch (action) {
            case 'createRoom': {
                if (!title || playerId === undefined) {
                    return NextResponse.json({ error: '방제목과 방장의 플레이어 아이디가 필요합니다.' }, { status: 400 });
                }
                const roomRef = push(ref(dbInstance, 'rooms'));
                const newRoomId = roomRef.key!;
                await initializeRoomData(newRoomId, title, playerId);
                console.log(`[API POST] 방이 생성되었습니다. ${newRoomId}, 생성자 ${playerId}`);
                return NextResponse.json({ roomId: newRoomId, creatorId: playerId }, { status: 200 });
            }

            case 'joinRoom': {
                if (!roomId || playerId === undefined) {
                    return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
                }
                if (!playerChars.some(c => c.id === playerId)) {
                    return NextResponse.json({ error: 'Invalid playerId' }, { status: 400 });
                }
                const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
                if (!roomSnap.exists()) {
                    return NextResponse.json({ error: `방 번호 ${roomId} 은 존재하지 않습니다.` }, { status: 404 });
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

                // const selectedChar = playerChars.find(c => c.id === playerId)!.name;
                const selectedChar = playerChars.find(c => c.id === playerId);
                const updates: any = {
                    [`rooms/${roomId}/players/${playerId}`]: {
                        char: selectedChar?.name,
                        // name: selectedChar?.name,
                        avata: selectedChar?.avata,
                        position: 1,
                        joinedAt: Date.now(),
                        score: 0
                    }
                };
                if (roomData.creatorId === null) {
                    updates[`rooms/${roomId}/creatorId`] = playerId;
                }
                await update(ref(dbInstance), updates);
                return NextResponse.json({
                    success: true,
                    creatorId: roomData.creatorId || playerId
                }, { status: 200 });
            }


            /*
                        case 'joinRoom': {
                            const roomRef = ref(dbInstance, `rooms/${roomId}`);
                            await runTransaction(roomRef, (roomData) => {
                                if (!roomData) throw new ApiError(404, '방을 찾을 수 없습니다');
                                if (roomData.status !== 'waiting') throw new ApiError(400, '게임이 이미 시작되었습니다');
                                if (Object.keys(roomData.players || {}).length >= 4) throw new ApiError(400, '방이 가득 찼습니다');
                                if (roomData.players?.[playerId]) throw new ApiError(400, '이미 참여한 플레이어입니다');
                                const selectedChar = playerChars.find(c => c.id === playerId);
                                roomData.players = roomData.players || {};
                                roomData.players[playerId] = {
                                    char: selectedChar?.name,
                                    avata: selectedChar?.avata,
                                    position: 1,
                                    joinedAt: Date.now(),
                                    score: 0
                                };
                                if (roomData.creatorId === null) roomData.creatorId = playerId;
                                return roomData;
                            });
                            return NextResponse.json({ success: true, creatorId: (await get(roomRef)).val().creatorId || playerId }, { status: 200 });
                        }
             */
            case 'leaveRoom': {
                if (typeof playerId !== 'number') {
                    return NextResponse.json({ error: 'Invalid playerId' }, { status: 400 });
                }
                const roomRef = ref(dbInstance, `rooms/${roomId}`);
                const roomSnapshot = await get(roomRef);
                if (!roomSnapshot.exists()) {
                    return NextResponse.json({ error: 'Room does not exist' }, { status: 404 });
                }
                const roomData = roomSnapshot.val();
                const players = roomData.players || {};
                if (!players[playerId]) {
                    return NextResponse.json({ error: 'Player not in room' }, { status: 400 });
                }
                await remove(ref(dbInstance, `rooms/${roomId}/players/${playerId}`));
                const remainingPlayers = Object.keys(roomData.players)
                    .filter(id => id !== playerId.toString())
                    .map(id => ({ playerId: Number(id), joinedAt: roomData.players[id].joinedAt }));

                if (remainingPlayers.length === 0) {
                    await remove(roomRef);
                    return NextResponse.json({ success: true }, { status: 200 });
                }

                // 턴 전환 로직 수정
                // if (roomData.currentTurn === playerId) {
                //     // 남은 플레이어를 참가 순서(joinedAt)로 정렬
                //     const sortedPlayers = remainingPlayers.sort((a, b) => a.joinedAt - b.joinedAt);
                //     // 다음 턴 플레이어 선택: 첫 번째 플레이어로 설정 (nextTurn 로직과 동일)
                //     const nextPlayerId = sortedPlayers[0]?.playerId ?? null;
                //     await update(roomRef, { currentTurn: nextPlayerId });
                //     console.log(`[API POST] Updated currentTurn to ${nextPlayerId} after player ${playerId} left`);
                // }
                // 턴 전환 로직 수정
                if (roomData.currentTurn === playerId) {
                    // 모든 플레이어(나가기 전)를 참가 순서로 정렬
                    const allPlayers = Object.keys(players)
                        .map(id => ({ playerId: Number(id), joinedAt: players[id].joinedAt }))
                        .sort((a, b) => a.joinedAt - b.joinedAt);

                    // 현재 턴 플레이어의 인덱스 찾기
                    const currentIndex = allPlayers.findIndex(p => p.playerId === playerId);

                    // 남은 플레이어를 참가 순서로 정렬
                    const sortedPlayers = remainingPlayers.sort((a, b) => a.joinedAt - b.joinedAt);

                    // 다음 턴 인덱스 계산
                    const nextIndex = (currentIndex + 1) % allPlayers.length;

                    // 다음 턴 플레이어 찾기
                    let nextPlayerId: number | null = null;
                    if (sortedPlayers.length > 0) {
                        // 다음 인덱스에 해당하는 플레이어가 남아 있는지 확인
                        const nextPlayer = allPlayers[nextIndex];
                        if (sortedPlayers.some(p => p.playerId === nextPlayer.playerId)) {
                            nextPlayerId = nextPlayer.playerId;
                        } else {
                            // 다음 플레이어가 이미 나갔다면, 남은 플레이어 중 첫 번째로
                            nextPlayerId = sortedPlayers[0].playerId;
                        }
                    }

                    await update(roomRef, { currentTurn: nextPlayerId });
                    console.log(`[API POST] Updated currentTurn to ${nextPlayerId} after player ${playerId} left`);
                }

                // 마지막 주사위 굴림이 나간 플레이어의 것이라면 제거
                if (roomData.lastRoll?.playerId === playerId) {
                    await remove(ref(dbInstance, `rooms/${roomId}/lastRoll`));
                }
                return NextResponse.json({ success: true, playerCount: remainingPlayers.length }, { status: 200 });
            }

            case 'deleteRoom': {
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

            case 'forceDeleteRoom': {
                if (!roomId || playerId === undefined) {
                    return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
                }
                const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
                if (!roomSnap.exists()) {
                    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
                }
                await remove(ref(dbInstance, `rooms/${roomId}`));
                console.log(`[API POST] Force deleted room ${roomId} by player ${playerId}`);
                return NextResponse.json({ success: true }, { status: 200 });
            }

            case 'startGame': {
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
                    return NextResponse.json({ error: `게임 플레이어는 최소 2명이상이어야 합니다. 현재: ${playerCount}/4` }, { status: 400 });
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

            case 'rollDice': {
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

            case 'moveToken': {
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
                    if (timeDiff < 2000) {
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
                    return NextResponse.json({ error: 'Position update failed' }, { status: 500 });
                }

                const updates: any = {
                    [`rooms/${roomId}/players/${playerId}/position`]: finalPosition,
                    [`rooms/${roomId}/players/${playerId}/lastMoveTimestamp`]: Date.now(),
                    [`rooms/${roomId}/lastRoll`]: null
                };
                await update(ref(dbInstance), updates);
                console.log(`[API POST] moveToken: player ${playerId} moved to ${finalPosition}, room ${roomId}`);
                const playersSnap = await get(ref(dbInstance, `rooms/${roomId}/players`));
                const players = playersSnap.val() || {};
                return NextResponse.json({ players, newPosition: finalPosition }, { status: 200 });
            }

            case 'submitScore': {
                if (!roomId || playerId === undefined || typeof score !== 'number') {
                    return NextResponse.json({ error: 'roomId, playerId, and score required' }, { status: 400 });
                }
                const playerRef = ref(dbInstance, `rooms/${roomId}/players/${playerId}`);
                const playerSnap = await get(playerRef);
                if (!playerSnap.exists()) {
                    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
                }
                const currentScore = playerSnap.val().score || 0;
                if (score < 0 || score > 50) {
                    return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
                }
                await update(playerRef, { score: currentScore + score });
                console.log(`[API POST] Updated score for player ${playerId} in room ${roomId}: +${score}`);
                return NextResponse.json({ success: true }, { status: 200 });
            }

            // case 'nextTurn': {
            //     if (!roomId || playerId === undefined) {
            //         return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
            //     }
            //     const roomRef = ref(dbInstance, `rooms/${roomId}`);
            //     const roomSnap = await get(roomRef);
            //     if (!roomSnap.exists()) {
            //         return NextResponse.json({ error: 'Room not found' }, { status: 404 });
            //     }
            //     const roomData = roomSnap.val();
            //     const players = Object.keys(roomData.players || {}).map(Number);
            //     const currentTurn = roomData.currentTurn;
            //     const currentIndex = players.indexOf(currentTurn);
            //     const nextIndex = (currentIndex + 1) % players.length;
            //     const nextTurn = players[nextIndex];
            //     await update(roomRef, { currentTurn: nextTurn });
            //     console.log(`[API POST] Advanced turn in room ${roomId} to player ${nextTurn}`);
            //     return NextResponse.json({ success: true }, { status: 200 });
            // }
            case 'nextTurn': {
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
                if (players.length === 0) {
                    return NextResponse.json({ error: 'No players in room' }, { status: 400 });
                }
                const sortedPlayers = players.sort((a, b) => roomData.players[a].joinedAt - roomData.players[b].joinedAt);
                const currentTurn = roomData.currentTurn;
                let nextIndex = sortedPlayers.indexOf(currentTurn);
                if (nextIndex === -1) {
                    // 현재 턴이 유효하지 않으면 (예: 플레이어가 나감) 첫 번째 플레이어로
                    nextIndex = 0;
                } else {
                    nextIndex = (nextIndex + 1) % sortedPlayers.length;
                }
                const nextTurn = sortedPlayers[nextIndex];
                await update(roomRef, { currentTurn: nextTurn });
                console.log(`[API POST] Advanced turn in room ${roomId} to player ${nextTurn}`);
                return NextResponse.json({ success: true, nextTurn }, { status: 200 });
            }


            case 'resetGame': {
                if (!roomId || playerId === undefined) {
                    return NextResponse.json({ error: 'roomId and playerId required' }, { status: 400 });
                }
                const roomSnap = await get(ref(dbInstance, `rooms/${roomId}`));
                if (!roomSnap.exists()) {
                    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
                }
                const roomData = roomSnap.val();
                if (playerId !== roomData.creatorId) {
                    return NextResponse.json({ error: '방장만 게임을 초기화 할 수 있습니다.' }, { status: 403 });
                }
                const players = roomData.players || {};
                const playerCount = Object.keys(players).length;
                if (playerCount < 2) {
                    return NextResponse.json({ error: `최소 2명이 참여해야 게임 시작이 가능합니다. 현재 ${playerCount}/4명` }, { status: 400 });
                }
                const { players: resetPlayers, colorGroup } = await resetGameData(roomId);
                return NextResponse.json({ players: resetPlayers, colorGroup }, { status: 200 });
            }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (err) {
        // console.error(`[API POST] Error in ${action}:`, err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
