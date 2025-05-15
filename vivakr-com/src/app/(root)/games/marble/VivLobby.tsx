'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/clientApp';
import { ref, onValue, off } from 'firebase/database';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import VivTitle from '@/components/VivTitle';
import { TextField } from '@mui/material';

interface Room {
    id: string;
    title: string;
    creatorId: number | null;
    status: 'waiting' | 'playing';
    playerCount: number;
    players: { [key: number]: { char: string } };
}

const playerChars = [
    { id: 0, name: "vivakr.webp" },
    { id: 1, name: "smile.webp" },
    { id: 2, name: "man.webp" },
    { id: 3, name: "buddha.webp" }
];

export default function VivLobby() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoomTitle, setNewRoomTitle] = useState('');
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const roomsRef = ref(db, 'rooms');
        const unsubscribe = onValue(roomsRef, (snapshot) => {
            const roomsData = snapshot.val() || {};
            const roomList = Object.entries(roomsData).map(([id, data]: [string, any]) => ({
                id,
                title: data.title,
                creatorId: data.creatorId,
                status: data.status,
                playerCount: Object.keys(data.players || {}).length,
                players: data.players || {}
            }));
            console.log('[VivLobby] Real-time rooms:', roomList);
            setRooms(roomList);
        }, (err) => {
            console.error('[VivLobby] Real-time rooms error:', err);
        });

        return () => off(roomsRef, 'value', unsubscribe);
    }, []);

    const handleCreateRoom = async () => {
        if (isCreating) return;
        if (!newRoomTitle.trim()) {
            alert('방 제목을 입력하세요.');
            return;
        }
        if (selectedPlayerId === null) {
            alert('캐릭터를 선택하세요.');
            return;
        }

        setIsCreating(true);
        try {
            const createRes = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'createRoom', title: newRoomTitle, playerId: selectedPlayerId })
            });
            const createData = await createRes.json();

            if (!createRes.ok || !createData.roomId) {
                alert(createData.error || '방 생성 실패');
                setIsCreating(false);
                return;
            }

            const joinRes = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'joinRoom', roomId: createData.roomId, playerId: selectedPlayerId })
            });
            const joinData = await joinRes.json();

            if (joinRes.ok) {
                router.push(`/games/marble/${createData.roomId}?playerId=${selectedPlayerId}`);
            } else {
                alert(joinData.error || '방 입장 실패');
                setIsCreating(false);
            }
        } catch (err) {
            alert('방 생성 또는 입장 중 오류 발생');
            setIsCreating(false);
        }
    };

    const handleForceDeleteRoom = async (roomId: string) => {
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'forceDeleteRoom', roomId, playerId: selectedPlayerId })
            });
            const data = await res.json();
            if (res.ok) {
            } else {
                alert(data.error || '방 삭제 실패');
            }
        } catch (err) {
            alert('방 삭제 중 오류 발생');
        }
    };
    const handleDeleteRoom = async (roomId: string) => {
        if (!confirm('정말로 이 방을 삭제하시겠습니까?')) {
            return;
        }
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deleteRoom', roomId, playerId: selectedPlayerId })
            });
            const data = await res.json();
            if (res.ok) {
            } else {
                alert(data.error || '방 삭제 실패');
            }
        } catch (err) {
            alert('방 삭제 중 오류 발생');
        }
    };

    const handleJoinRoom = async (roomId: string, players: Room['players']) => {
        if (selectedPlayerId === null) {
            alert('캐릭터를 선택하세요.');
            return;
        }
        if (players[selectedPlayerId]) {
            alert('이미 선택된 캐릭터입니다.');
            return;
        }
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'joinRoom', roomId, playerId: selectedPlayerId })
            });
            const data = await res.json();
            console.log('[VivLobby] Join room response:', data);
            if (res.ok) {
                router.push(`/games/marble/${roomId}?playerId=${selectedPlayerId}`);
            } else {
                alert(data.error || '방 입장 실패');
            }
        } catch (err) {
            console.error('[VivLobby] Join room error:', err);
            alert('방 입장 중 오류 발생');
        }
    };

    const handlePlayerChange = (event: SelectChangeEvent<string>) => {
        const playerId = event.target.value === '' ? null : Number(event.target.value);
        setSelectedPlayerId(playerId);
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center">
            <VivTitle title='푸른 구슬의 전설' />

            <div className="w-full max-w-md">
                <>
                    <h2 className="text-xl font-semibold mb-4 text-slate-400 text-center">방 목록</h2>
                    {rooms.length === 0 ? (
                        <p className='text-slate-400 text-sm'>아직 생성된 방이 없습니다. 방 생성을 통하여 방을 만드세요...</p>
                    ) : (

                        rooms.map((room) => (
                            <div key={room.id}
                                className="bg-white p-4 rounded-lg
                                            shadow-md mb-4
                                            flex justify-between
                                            items-center" >
                                <div className='w-32 flex flex-col items-center justify-baseline py-8'>
                                    <h3 className="font-bold text-sky-700">{room.title}</h3>
                                    <p className='text-xs text-slate-400'>
                                        {room.status === 'waiting' ? '대기중 ' : '게임중 '}
                                        <span className='text-red-400 text-nowrap font-bold'>
                                            ( {room.playerCount} / 4 )

                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center w-full gap-2">

                                    <FormControl variant="filled" sx={{ width: '100%' }}>
                                        <InputLabel id={`join-char-label-${room.id}`}>캐릭터</InputLabel>
                                        <Select
                                            labelId={`join-char-label-${room.id}`}
                                            value={selectedRoomId === room.id ? (selectedPlayerId?.toString() ?? '') : ''}
                                            onChange={(e) => {
                                                setSelectedRoomId(room.id);
                                                handlePlayerChange(e);
                                            }}
                                            disabled={room.status !== 'waiting' || room.playerCount >= 4}
                                        >
                                            <MenuItem value=""> <em>선택 안함</em> </MenuItem>

                                            {playerChars.map((char, idx) => (
                                                <MenuItem
                                                    key={idx}
                                                    value={char.id.toString()}
                                                    disabled={!!room.players[char.id]} > {char.name.split('.')[0]}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <button onClick={() => handleJoinRoom(room.id, room.players)}
                                        disabled={
                                            room.status !== 'waiting' ||
                                            room.playerCount >= 4 ||
                                            selectedPlayerId === null ||
                                            selectedRoomId !== room.id
                                        }
                                        className="bg-sky-400 text-white
                                                     p-2 rounded-full cursor-pointer w-24
                                                    hover:bg-green-600
                                                    disabled:bg-gray-400">
                                        입장
                                    </button>

                                    {/* {selectedPlayerId === room.creatorId && (
                                    <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                    >
                                        삭제
                                    </button>
                                    )} */}

                                    <button
                                        onClick={() => handleForceDeleteRoom(room.id)}
                                        className="bg-slate-400
                                                   text-white
                                                    cursor-pointer w-16
                                                    p-2
                                                    rounded-full
                                                   hover:bg-red-600">
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))

                    )}

                </>
            </div>

            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4 text-amber-800 text-center">방 만들기</h2>
                <p className='text-xs text-slate-400'>
                    아래의 방목록을 먼저 확인하세요.
                </p>
                <p className='text-xs text-slate-400'>
                    방을 생성하시면 자동으로 해당 방의 방장이 되며, 자동입장 됩니다.
                </p>
                <TextField
                    label="방 이름 / 제목 / Room Title"
                    onChange={(e) => setNewRoomTitle(e.target.value)}
                    className='w-full !my-4'
                    variant="outlined" />

                <FormControl variant="filled" sx={{ minWidth: '100%', mb: 4 }}>
                    <InputLabel id="select-char">캐릭터 선택</InputLabel>
                    <Select
                        labelId="select-char"
                        value={selectedPlayerId?.toString() ?? ''}
                        onChange={handlePlayerChange}
                    >
                        <MenuItem value="">
                            <em className='text-slate-400'>선택 안함</em>
                        </MenuItem>
                        {playerChars.map((char) => (
                            <MenuItem key={char.id}
                                className='!text-base !font-extrabold !text-sky-800'
                                value={char.id.toString()}>
                                {char.name.split('.')[0]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <button
                    onClick={handleCreateRoom}
                    disabled={!newRoomTitle.trim() || selectedPlayerId === null || isCreating}
                    className="w-full
                    bg-blue-500 text-white
                    p-2 rounded
                    hover:bg-blue-600
                    cursor-pointer
                    disabled:bg-gray-400"
                >
                    방 생성
                </button>
            </div>
        </div>
    );
}
