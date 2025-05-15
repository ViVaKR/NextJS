'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './VivMarble.module.css';
import Image from 'next/image';
import { db } from '@/lib/firebase/clientApp';
import { ref, onValue, off, DataSnapshot, update } from 'firebase/database';
import WaitingRoom from './WaitingRoom';
import VivTitle from './VivTitle';
import VivMarbleQnA from './VivMarbleQnA';

interface ColorGroups {
    sky: number[];
    red: number[];
}

interface Player {
    playerId: number;
    char: string;
    position: number;
    joinedAt: number;
    lastMoveTimestamp?: number;
    score?: number;
}

interface VivMarbleProps {
    roomId: string;
    playerId: number;
}

interface Gammer {
    name: string;
    score: number;
}

export default function VivMarble({ roomId, playerId }: VivMarbleProps) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentRollingPlayerId, setCurrentRollingPlayerId] = useState<number | null>(null);
    const [colorGroup, setColorGroup] = useState<ColorGroups | null>(null);
    const [status, setStatus] = useState<'waiting' | 'playing' | 'ended'>('waiting');
    const [creatorId, setCreatorId] = useState<number>(-1);
    const [title, setTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentTurn, setCurrentTurn] = useState<number | null>(null);
    const [score, setScore] = useState<Gammer | null>(null);
    const [isQnAOpen, setIsQnAOpen] = useState(false);
    const [playerScores, setPlayerScores] = useState<{ [playerId: number]: number }>({});
    const [turnCount, setTurnCount] = useState<number>(0);
    const [solvedQuestions, setSolvedQuestions] = useState<number[]>([]);
    const [lastDiceValue, setLastDiceValue] = useState<number>(1);
    const router = useRouter();

    useEffect(() => {
        const roomRef = ref(db, `rooms/${roomId}`);
        const unsubscribe = onValue(
            roomRef,
            (snapshot: DataSnapshot) => {
                if (snapshot.exists()) {
                    const roomData = snapshot.val();
                    setStatus(roomData.status || 'waiting');
                    setCreatorId(roomData.creatorId ?? -1);
                    setTitle(roomData.title || '');
                    setColorGroup(roomData.colorGroup || null);
                    setCurrentTurn(roomData.currentTurn ?? null);
                    setTurnCount(roomData.turnCount || 0);
                    const playersData = roomData.players || {};
                    const playerList = Object.entries(playersData).map(([id, p]: [string, any]) => ({
                        playerId: Number(id),
                        char: p.char,
                        position: p.position || 1,
                        joinedAt: p.joinedAt,
                        lastMoveTimestamp: p.lastMoveTimestamp,
                        score: p.score || 0,
                    }));

                    setPlayers(playerList);

                    const updatedScores = playerList.reduce((acc, p) => {
                        acc[p.playerId] = p.score || 0;
                        return acc;
                    }, {} as { [playerId: number]: number });

                    setPlayerScores(updatedScores);

                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                    router.push('/games/marble');
                }
            },
            (e) => {
                setIsLoading(false);
            }
        );

        return () => {
            off(roomRef, 'value', unsubscribe);
        };
    }, [roomId, router]);

    const handleDeleteRoom = async () => {
        if (!confirm('정말로 이 방을 삭제하시겠습니까?')) {
            return;
        }
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deleteRoom', roomId, playerId }),
            });
            const data = await res.json();
            if (res.ok) {
                console.log('[VivMarble] Deleted room:', roomId);
                router.push('/games/marble');
            } else {
                console.error('[VivMarble] Delete room error:', data.error);
                alert(data.error || '방 삭제 실패');
            }
        } catch (err) {
            console.error('[VivMarble] Delete room error:', err);
            alert('방 삭제 중 오류 발생');
        }
    };

    const handleResetRoom = async () => {
        if (!confirm('정말로 이 방을 다시 시작 하시겠습니까?')) {
            return;
        }
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'resetGame', roomId, playerId }),
            });
            const data = await res.json();
            if (res.ok) {
                console.log('[VivMarble] Reset room:', roomId);
                alert('게임이 초기화되었습니다.');
                setPlayerScores({});
                setTurnCount(0);
                setSolvedQuestions([]);
            } else {
                console.error('[VivMarble] Reset room error:', data.error);
                alert(data.error || '방 초기화 실패');
            }
        } catch (err) {
            console.error('[VivMarble] Reset room error:', err);
            alert('방 초기화 중 오류 발생');
        }
    };

    const buildDice = () => {
        const pipMap = {
            1: ['pos-c'],
            2: ['pos-tl', 'pos-br'],
            3: ['pos-tl', 'pos-c', 'pos-br'],
            4: ['pos-tl', 'pos-tr', 'pos-bl', 'pos-br'],
            5: ['pos-tl', 'pos-tr', 'pos-c', 'pos-bl', 'pos-br'],
            6: ['pos-lt', 'pos-lm', 'pos-lb', 'pos-rt', 'pos-rm', 'pos-rb'],
        };
        const faces = [];
        for (let f = 1; f <= 6; f++) {
            const pips = pipMap[f as keyof typeof pipMap].map((pos: string, idx: number) => (
                <div key={idx} className={`${styles.pip} ${styles[pos]}`} />
            ));
            faces.push(
                <div key={f} className={`${styles.face} ${styles[`face-${f}`]}`} data-face={f}>
                    {pips}
                </div>
            );
        }
        return faces;
    };

    const rollDice = async (playerId: number) => {
        if (currentRollingPlayerId != null || currentTurn !== playerId) return;
        setCurrentRollingPlayerId(playerId);
        setIsQnAOpen(false); // New: Close QnA before rolling
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'rollDice', roomId, playerId }),
            });
            const data = await res.json();
            if (res.ok) {
                setLastDiceValue(data.diceResult); // New: Store dice value
                animateDice(data.diceResult, 4000, 2016, playerId, () => {
                    moveToken(playerId, data.diceResult);
                });
            } else {
                console.error('[VivMarble] Roll dice error:', data.error);
                throw new Error(data.error);
            }
        } catch (err) {
            console.error('[VivMarble] Roll dice error:', err);
            alert('주사위 굴리기 실패');
        } finally {
            setCurrentRollingPlayerId(null);
        }
    };

    const moveToken = async (playerId: number, diceValue: number) => {
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'moveToken', roomId, playerId, diceValue }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('[VivMarble] Move token error:', data.error);
                throw new Error(data.error);
            }
            console.log(
                '[VivMarble] Move token completed for player:',
                playerId,
                'New position:',
                data.newPosition,
                'Next turn:',
                data.nextTurn
            );
            // New: Open QnA only for current player after move
            if (playerId === currentTurn && playerId === playerId) {
                console.log('[VivMarble] Opening QnA for player:', playerId, 'Position:', data.newPosition);
                setIsQnAOpen(true);
            }
        } catch (err) {
            console.error('[VivMarble] Move token error:', err);
        }
    };

    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    const animateDice = (
        result: number,
        duration: number,
        spins: number,
        playerId: number,
        onAnimationEnd?: () => void
    ) => {
        const rotMap = { 1: [0, 0], 2: [0, -90], 3: [0, 180], 4: [0, 90], 5: [-90, 0], 6: [90, 0] };
        const [targetX, targetY] = rotMap[result as keyof typeof rotMap];
        const startTime = performance.now();
        const diceEl = document.getElementById('dice');
        if (!diceEl) return;

        diceEl.classList.remove(styles.hidden);
        diceEl.style.display = 'block';

        const animate = (currentTime: number) => {
            const elapsed = (currentTime - startTime) / 1000;
            const progress = Math.min(elapsed / (duration / 1000), 1);
            const eased = easeOutQuad(progress);
            const rotX = targetX + spins * (1 - eased);
            const rotY = targetY + spins * (1 - eased);
            let scale = 1;
            if (progress < 0.5) scale = 1 + 0.15 * (progress / 0.5);
            else if (progress < 0.75) scale = 1.15 - 0.2 * ((progress - 0.5) / 0.25);
            else scale = 0.95 + 0.05 * ((progress - 0.75) / 0.25);
            diceEl.style.transform = `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    diceEl.style.transform = `translate(-50%, -50%) scale(1)`;
                    diceEl.style.display = 'none';
                    if (onAnimationEnd) onAnimationEnd();
                    console.log('[VivMarble] Dice animation complete for player:', playerId);
                }, 1000);
            }
        };
        requestAnimationFrame(animate);
    };

    const handleQnAClose = () => {
        setIsQnAOpen(false);
        advanceTurn();
    };

    const advanceTurn = async () => {
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'nextTurn', roomId, playerId }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('[VivMarble] Advance turn error:', data.error);
                alert(data.error || '턴 전환 실패');
                return;
            }
            const newTurnCount = turnCount + 1;
            setTurnCount(newTurnCount);
            await update(ref(db, `rooms/${roomId}`), { turnCount: newTurnCount });
            console.log(`[VivMarble] Turn advanced, new turn count: ${newTurnCount}`);
            if (newTurnCount >= 50) {
                setStatus('ended');
                await update(ref(db, `rooms/${roomId}`), { status: 'ended' });
            }
        } catch (err) {
            console.error('[VivMarble] Advance turn error:', err);
            alert('턴 전환 중 오류 발생');
        }
    };

    const onSubmitScore = async (playerId: number, score: number, qna: number) => {
        setPlayerScores((prev) => ({
            ...prev,
            [playerId]: (prev[playerId] || 0) + score,
        }));
        setSolvedQuestions((prev) => [...prev, qna]);

        try {
            const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
            await update(playerRef, { score: (playerScores[playerId] || 0) + score });

            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'submitScore',
                    roomId,
                    playerId,
                    score,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('[VivMarble] Submit score error:', data.error);
                alert(data.error || '점수 저장 실패');
                return;
            }

            const targetScore = 500;
            if (playerScores[playerId] + score >= targetScore) {
                setStatus('ended');
                await update(ref(db, `rooms/${roomId}`), { status: 'ended' });
                return;
            }

            await advanceTurn();
        } catch (err) {
            console.error('[VivMarble] Score submission error:', err);
            alert('점수 저장 중 오류 발생');
        }
    };

    const buildBoard = () => {
        const cells = [];
        for (let i = 1; i <= 100; i++) {
            const red = colorGroup?.red.some((x) => x === i);
            const sky = colorGroup?.sky.some((x) => x === i);
            const bgColor = red ? `${styles.cell} !bg-red-200` : sky ? `${styles.cell} !bg-sky-200` : styles.cell;
            const playersInCell = players.filter((p) => p.position === i);
            cells.push(
                <div key={i} className={bgColor} id={`cell-${i}`}>
                    <span className={styles.idx}>{i}</span>
                    <div className={styles.playerContainer}>
                        {playersInCell.map((player, index) => (
                            <div key={player.playerId} className={styles.tokenWrapper} style={{ zIndex: index + 1 }}>
                                <Image
                                    className={styles.token}
                                    data-player-id={player.playerId}
                                    width={30}
                                    height={30}
                                    src={`/assets/images/${player.char}`}
                                    alt=""
                                    priority={player.position === 1}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return cells;
    };

    if (status === 'ended') {
        const sortedPlayers = [...players].sort((a, b) => (playerScores[b.playerId] || 0) - (playerScores[a.playerId] || 0));
        return (
            <div className={`${styles.game} min-h-screen w-full flex flex-col items-center justify-center gap-4`}>
                <VivTitle title={`푸른구슬의 전설 ( ${title} ) - 게임 종료`} />
                <h2 className="text-2xl font-bold text-sky-800">최종 순위</h2>
                <div className="flex flex-col gap-2 text-slate-500 text-lg">
                    {sortedPlayers.map((p, index) => (
                        <div key={p.playerId} className="flex gap-4">
                            <span>{index + 1}위:</span>
                            <span>{p.char.split('.')[0]}</span>
                            <span>{playerScores[p.playerId] || 0}점</span>
                        </div>
                    ))}
                </div>
                {playerId === creatorId && (
                    <div className="flex gap-4">
                        <button
                            onClick={handleResetRoom}
                            className="bg-amber-400 text-white px-4 py-2 rounded-full hover:bg-amber-600"
                        >
                            게임 재시작
                        </button>
                        <button
                            onClick={handleDeleteRoom}
                            className="bg-red-400 text-white px-4 py-2 rounded-full hover:bg-red-600"
                        >
                            방 삭제
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (isLoading) return <div className="flex justify-center items-center">로딩 중...</div>;

    const currentPlayer = players.find((p) => p.playerId === playerId);

    if (status === 'waiting') {
        return (
            <WaitingRoom
                roomId={roomId}
                playerId={playerId}
                creatorId={creatorId}
                title={title}
            // onStartGame={() => setStatus('playing')}
            />
        );
    }

    return (
        <div className={`${styles.game} min-h-screen w-full`}>
            <VivTitle title={`푸른구슬의 전설 ( ${title} )`} />
            <div className="flex justify-center items-center gap-4 text-sky-800 font-extrabold text-3xl">
                {currentPlayer ? currentPlayer.char.split('.')[0].toUpperCase() : '-'}
                {playerId === creatorId && (
                    <span className="text-rose-300 font-extrabold text-xs mt-auto mb-1">방장</span>
                )}
            </div>
            <div className="flex justify-center items-center gap-4 text-slate-500 text-xs">
                {players.map((p) => (
                    <span key={p.playerId}>
                        {p.char.split('.')[0]}: {playerScores[p.playerId] || 0}점
                    </span>
                ))}
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                <div id="board" className={`${styles.board} relative w-full !justify-center`}>
                    {buildBoard()}
                    <div id="dice" className={`${styles.dice} absolute-center`}>
                        {buildDice()}
                    </div>
                </div>
                <div className="flex justify-center items-center text-slate-500 text-xs gap-4 h-12">
                    <span>
                        총 플레이어 (<em className="text-sky-500 mx-2 font-bold">{players.length} / 4</em>)
                    </span>
                    <span>
                        현재 턴 [
                        <em className="text-sky-500 mx-2 font-bold">
                            {currentTurn !== null
                                ? players.find((p) => p.playerId === currentTurn)?.char.split('.')[0] || '알 수 없음'
                                : '없음'}
                        </em>
                        ]
                    </span>
                    <span>
                        턴 수 [<em className="text-sky-500 mx-2 font-bold">{turnCount} / 50</em>]
                    </span>
                    {score && (
                        <span className="h-12 flex items-center px-4">
                            직전 플레이어 [<em className="text-sky-500 mx-2 font-bold">{score.name}</em>] 의 주사위 숫자 [
                            <em className="text-sky-500 mx-2 font-bold">{score.score}</em>]
                        </span>
                    )}
                </div>
                <div className="flex justify-center w-full gap-2 items-center">
                    {players.map((player) => (
                        <button
                            key={player.playerId}
                            className={`${styles.button} !w-full ${currentRollingPlayerId === player.playerId ? styles.rolling : ''
                                } ${currentTurn !== player.playerId ? styles.disabled : ''}`}
                            onClick={() => rollDice(player.playerId)}
                            disabled={playerId !== currentTurn}
                            hidden={currentTurn !== player.playerId || currentRollingPlayerId !== null}
                        >
                            {player.char.split('.')[0]} {player.playerId === creatorId ? '(방장)' : ''}{' '}
                            {currentTurn === player.playerId ? '(턴)' : ''}
                        </button>
                    ))}
                    {playerId === creatorId && (
                        <>
                            <button
                                onClick={handleDeleteRoom}
                                className="bg-red-400 text-white w-48 px-4 py-2 cursor-pointer rounded-full hover:bg-red-600"
                            >
                                방 삭제
                            </button>
                            <button
                                onClick={handleResetRoom}
                                className="bg-amber-400 text-white w-48 px-4 py-2 cursor-pointer rounded-full hover:bg-amber-600"
                            >
                                방 갱신
                            </button>
                        </>
                    )}
                </div>
                <div className="flex gap-4 justify-evenly w-full text-slate-400">
                    {players.map((player, idx) => (
                        <span
                            key={idx}
                            className={player.playerId === currentTurn ? 'text-red-400 font-extrabold' : ''}
                        >
                            {player.char.split('.')[0]}
                        </span>
                    ))}
                </div>
                {/* Modified: Simplified QnA rendering condition */}
                {currentPlayer?.position && playerId === currentTurn && isQnAOpen && (
                    <VivMarbleQnA
                        qna={currentPlayer.position}
                        open={isQnAOpen}
                        onClose={handleQnAClose}
                        roomId={roomId}
                        diceValue={lastDiceValue}
                        playerId={playerId}
                        onSubmitScore={onSubmitScore}
                        colorGroup={colorGroup}
                        solvedQuestions={solvedQuestions}
                    />
                )}
            </div>
        </div>
    );
}
