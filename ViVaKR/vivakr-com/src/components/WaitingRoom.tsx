
'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/clientApp';
import { ref, onValue, off } from 'firebase/database';
import Image from 'next/image';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useRouter } from 'next/navigation';
import { IMarbleChar } from '@/interfaces/i-player-char';
import { marbleChars } from '@/data/avata-marble';

interface Player {
    playerId: number;
    char: string;
    avata: string;
    position: number;
    joinedAt: number;
}

interface WaitingRoomProps {
    roomId: string;
    playerId: number | null;
    creatorId: number | null;
    title: string;
    // onStartGame: () => void;
}

const playerChars: IMarbleChar[] = marbleChars;

export default function WaitingRoom({ roomId, playerId, creatorId, title,
    // onStartGame
}: WaitingRoomProps) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(playerId);
    const hasJoinedRef = useRef(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const router = useRouter();
    // const router = useRouter();

    // Firebase 플레이어 리스너
    useEffect(() => {
        console.log('[대기방] Setting up players listener for room:', roomId);
        const playersRef = ref(db, `rooms/${roomId}/players`);
        const unsubscribe = onValue(playersRef, (snapshot) => {
            const data = snapshot.val() || {};
            const playerList = Object.entries(data).map(([id, p]: [string, any]) => ({
                playerId: Number(id),
                char: p.char,
                avata: p.avata,
                position: p.position || 1,
                joinedAt: p.joinedAt
            }));
            console.log('[대기방] Players updated:', playerList);
            setPlayers(playerList);

        }, (err) => {
            console.error('[WaitingRoom] Players listener error:', err);
        });

        return () => {
            console.log('[대기방] Cleaning up players listener');
            off(playersRef, 'value', unsubscribe);
        };
    }, [roomId, selectedPlayerId]);

    const handleJoin = async () => {
        if (selectedPlayerId === null) {
            alert('캐릭터를 선택하세요.');
            return;
        }
        if (players.some(p => p.playerId === selectedPlayerId)) {
            alert('이미 선택된 캐릭터입니다.');
            return;
        }
        try {
            console.log('[WaitingRoom] Joining room:', roomId, 'playerId:', selectedPlayerId);
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'joinRoom', roomId, playerId: selectedPlayerId })
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('[WaitingRoom] Join error:', data.error);
                alert(data.error || '입장 실패');
            }
        } catch (err) {
            console.error('[WaitingRoom] Join error:', err);
            alert('입장 중 오류 발생');
        }
    };

    const handleLeaveRoom = async () => {
        if (isLeaving) return;
        setIsLeaving(true);
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'leaveRoom',
                    roomId,
                    playerId: selectedPlayerId
                })
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('[대기방] 방 탈출 오류:', data.error);
            }

        } catch (err: any) {
            console.error('[대기방] 방 탈출 오류:', err);
        } finally {
            setIsLeaving(false);
        }
    }

    const handleDeleteRoom = async () => {
        if (isLeaving) return;
        setIsLeaving(true);
        try {
            console.log('[WaitingRoom] Deleting room:', roomId, 'playerId:', selectedPlayerId);
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deleteRoom', roomId, playerId: selectedPlayerId })
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('[WaitingRoom] Delete room error:', data.error);
                alert(data.error || '방 삭제 실패');
            } else {
                hasJoinedRef.current = false;
                router.push('/odds/marble');
            }
        } catch (err) {
            console.error('[WaitingRoom] Delete room error:', err);
            alert('방 삭제 중 오류 발생');
        } finally {
            setIsLeaving(false);
        }
    };

    const handleStartGame = async () => {
        if (!isCreator) {
            alert('방장만 게임을 시작할 수 있습니다.');
            return;
        }
        if (players.length < 2) {
            alert('최소 2명의 플레이어가 필요합니다.');
            return;
        }
        try {
            console.log('[WaitingRoom] Starting game, roomId:', roomId);
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'startGame', roomId, playerId: selectedPlayerId })
            });
            const data = await res.json();
            if (res.ok) {
                // onStartGame();
            } else {
                console.error('[WaitingRoom] Start game error:', data.error);
                alert(data.error || '게임 시작 실패');
            }
        } catch (err) {
            console.error('[WaitingRoom] Start game error:', err);
            alert('게임 시작 중 오류');
        }
    };

    const handlePlayerChange = (event: SelectChangeEvent<string>) => {
        const newPlayerId = event.target.value === '' ? null : Number(event.target.value);
        console.log('[대기방] Player changed to:', newPlayerId);
        setSelectedPlayerId(newPlayerId);
    };

    const isCreator = selectedPlayerId === creatorId;
    const canStart = isCreator && players.length >= 2;
    const hasJoined = selectedPlayerId !== null
        && players.some(p => p.playerId === selectedPlayerId);

    return (
        <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <h2 className="text-xl mb-4">대기실 (플레이어: {players.length}/4)</h2>
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                {!hasJoined && (
                    <FormControl variant="filled" sx={{ m: 1, minWidth: '100%', mb: 4 }}>
                        <InputLabel id="select-char">캐릭터 선택</InputLabel>
                        <Select
                            id="select-char"
                            value={selectedPlayerId?.toString() ?? ''}
                            onChange={handlePlayerChange}
                        >
                            <MenuItem value="">
                                <em>선택 안함</em>
                            </MenuItem>
                            {playerChars.map((char) => (
                                <MenuItem
                                    key={char.id}
                                    value={char.id.toString()}
                                    disabled={players.some(p => p.playerId === char.id)}
                                >
                                    {char.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                {!hasJoined && (
                    <button
                        onClick={handleJoin}
                        disabled={selectedPlayerId === null}
                        className="w-full bg-blue-500 text-white p-2 rounded
                        hover:bg-blue-600 disabled:bg-gray-400 mb-4"
                    >
                        입장
                    </button>
                )}
                <h3 className="text-lg font-semibold mb-2">플레이어 목록</h3>
                {players.length === 0 ? (
                    <p>플레이어가 없습니다.</p>
                ) : (
                    players.map(player => (
                        <div key={player.playerId} className="flex items-center gap-2 mb-2">
                            <Image
                                src={`/assets/images/${player.avata}`}
                                alt={player.char}
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                            <span>{player.char.split('.')[0]}</span>
                            {player.playerId === creatorId && <span className="text-blue-500">(방장)</span>}
                        </div>
                    ))
                )}
                {isCreator && (
                    <>
                        <button
                            onClick={handleStartGame}
                            disabled={!canStart}
                            className={`w-full mt-4 p-2
                                    rounded-full
                                    text-white
                                    cursor-pointer
                                    ${canStart
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            게임 시작
                        </button>
                        <button
                            onClick={handleDeleteRoom}
                            className="w-full mt-4
                            bg-red-500
                            text-white p-2
                            rounded-full
                            cursor-pointer
                            hover:bg-red-600
                            disabled:bg-gray-400"
                        >
                            방 삭제
                        </button>
                    </>
                )}
                {hasJoined && !isCreator && (
                    <button
                        onClick={handleLeaveRoom}
                        disabled={isLeaving}
                        className="w-full mt-4 bg-orange-500
                        text-white p-2
                        hover:bg-orange-600
                        cursor-pointer
                        rounded-full
                        disabled:bg-gray-400"
                    >
                        나가기
                    </button>
                )}
            </div>
        </div>
    );
}
