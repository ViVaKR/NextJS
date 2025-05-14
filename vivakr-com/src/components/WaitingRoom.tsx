'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/clientApp';
import { ref, onValue, off } from 'firebase/database';
import Image from 'next/image';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Player {
    playerId: number;
    char: string;
    position: number;
    joinedAt: number;
}

interface WaitingRoomProps {
    roomId: string;
    playerId: number | null;
    creatorId: number | null;
    title: string;
    onStartGame: () => void;
}

const playerChars = [
    { id: 0, name: "vivakr.webp" },
    { id: 1, name: "smile.webp" },
    { id: 2, name: "man.webp" },
    { id: 3, name: "buddha.webp" }
];

export default function WaitingRoom({ roomId, playerId, creatorId, title, onStartGame }: WaitingRoomProps) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(playerId);

    useEffect(() => {
        const playersRef = ref(db, `rooms/${roomId}/players`);
        const unsubscribe = onValue(playersRef, (snapshot) => {
            const data = snapshot.val() || {};
            const playerList = Object.entries(data).map(([id, p]: [string, any]) => ({
                playerId: Number(id),
                char: p.char,
                position: p.position,
                joinedAt: p.joinedAt
            }));
            setPlayers(playerList);
        });
        return () => off(playersRef, 'value', unsubscribe);
    }, [roomId]);

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
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'joinRoom',
                    roomId, playerId: selectedPlayerId
                })
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || '입장 실패');
            }
        } catch (err) {
            console.error('[WaitingRoom] Join error:', err);
            alert('입장 중 오류 발생');
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
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'startGame',
                    roomId,
                    playerId: selectedPlayerId
                })
            });
            const data = await res.json();
            if (res.ok) {
                onStartGame();
            } else {
                alert(data.error || '게임 시작 실패');
            }
        } catch (err) {
            console.error('[WaitingRoom] Start game error:', err);
            alert('게임 시작 중 오류');
        }
    };

    const handlePlayerChange = (event: SelectChangeEvent<string>) => {
        const newPlayerId = event.target.value === ''
            ? null :
            Number(event.target.value);

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
                                    {char.name.split('.')[0]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                {!hasJoined && (
                    <button
                        onClick={handleJoin}
                        disabled={selectedPlayerId === null}
                        className="w-full bg-blue-500 text-white p-2
                        rounded hover:bg-blue-600 disabled:bg-gray-400 mb-4"
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
                                src={`/assets/images/${player.char}`}
                                alt={player.char}
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                            <span>{player.char.split('.')[0]}</span>
                            {player.playerId === creatorId
                                &&
                                <span className="text-blue-500">(방장)</span>}
                        </div>
                    ))
                )}
                {isCreator && (
                    <button
                        onClick={handleStartGame}
                        disabled={!canStart}
                        className={`w-full mt-4 p-2 rounded text-white ${canStart ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        게임 시작
                    </button>
                )}
            </div>
        </div>
    );
}
