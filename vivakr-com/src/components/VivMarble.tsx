'use client';

import { useState, useEffect } from 'react';
import styles from './VivMarble.module.css';
import Image from 'next/image';
import { db } from '@/lib/firebase/clientApp';
import { ref, onValue, off, DataSnapshot } from 'firebase/database';
import WaitingRoom from './WaitingRoom';

interface ColorGroups {
    sky: number[];
    red: number[];
}

interface LastDiceInfo {
    value: number;
    timestamp: number;
    playerId: number;
}

interface Player {
    playerId: number;
    char: string;
    position: number;
    joinedAt: number;
    lastMoveTimestamp?: number;
}

interface VivMarbleProps {
    roomId: string;
    playerId: number;
}

export default function VivMarble({ roomId, playerId }: VivMarbleProps) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentRollingPlayerId, setCurrentRollingPlayerId] = useState<number | null>(null);
    const [lastDiceRoll, setLastDiceRoll] = useState<LastDiceInfo | null>(null);
    const [colorGroup, setColorGroup] = useState<ColorGroups | null>(null);
    const [status, setStatus] = useState<'waiting' | 'playing'>('waiting');
    const [creatorId, setCreatorId] = useState<number>(-1);
    const [title, setTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [lastProcessedRoll, setLastProcessedRoll] = useState<string | null>(null);

    useEffect(() => {
        const roomRef = ref(db, `rooms/${roomId}`);
        const unsubscribe = onValue(roomRef, (snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
                const roomData = snapshot.val();
                setStatus(roomData.status || 'waiting');
                setCreatorId(roomData.creatorId ?? -1);
                setTitle(roomData.title || '');
                setColorGroup(roomData.colorGroup || null);
                const playersData = roomData.players || {};
                const playerList = Object.entries(playersData).map(([id, p]: [string, any]) => ({
                    playerId: Number(id),
                    char: p.char,
                    position: p.position || 1,
                    joinedAt: p.joinedAt,
                    lastMoveTimestamp: p.lastMoveTimestamp
                }));
                setPlayers(playerList);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }, (e) => {
            console.error('[Room Listener] Error:', e);
            setIsLoading(false);
        });
        return () => off(roomRef, 'value', unsubscribe);
    }, [roomId]);

    useEffect(() => {
        const lastRollRef = ref(db, `rooms/${roomId}/lastRoll`);
        const unsubscribe = onValue(lastRollRef, (snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
                const rollData = snapshot.val();
                if (rollData && typeof rollData.playerId === 'number' && typeof rollData.value === 'number') {
                    const rollKey = `${rollData.playerId}:${rollData.timestamp}`;
                    if (rollKey !== lastProcessedRoll) {
                        setLastDiceRoll(rollData);
                        setLastProcessedRoll(rollKey);
                        animateDice(rollData.value, 2000, 1080, rollData.playerId);
                    }
                }
            } else {
                setLastDiceRoll(null);
            }
        }, (e) => {
            console.error('[LastRoll Listener] Error:', e);
        });
        return () => off(lastRollRef, 'value', unsubscribe);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, lastProcessedRoll]);

    const buildDice = () => {
        const pipMap = {
            1: ['pos-c'],
            2: ['pos-tl', 'pos-br'],
            3: ['pos-tl', 'pos-c', 'pos-br'],
            4: ['pos-tl', 'pos-tr', 'pos-bl', 'pos-br'],
            5: ['pos-tl', 'pos-tr', 'pos-c', 'pos-bl', 'pos-br'],
            6: ['pos-lt', 'pos-lm', 'pos-lb', 'pos-rt', 'pos-rm', 'pos-rb']
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
        if (currentRollingPlayerId != null) return;
        setCurrentRollingPlayerId(playerId);
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'rollDice', roomId, playerId })
            });
            const data = await res.json();
            if (res.ok) {
                setLastDiceRoll({ playerId, value: data.diceResult, timestamp: Date.now() });
                animateDice(data.diceResult, 2000, 1080, playerId, () => {
                    moveToken(playerId, data.diceResult);
                });
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            console.error('[RollDice] Error:', err);
        } finally {
            setCurrentRollingPlayerId(null);
        }
    };

    const moveToken = async (playerId: number, diceValue: number) => {
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'moveToken', roomId, playerId, diceValue })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
        } catch (err) {
            console.error('[MoveToken] Error:', err);
        }
    };

    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    const animateDice = (result: number, duration: number, spins: number, playerId: number, onAnimationEnd?: () => void) => {
        const rotMap = { 1: [0, 0], 2: [0, -90], 3: [0, 180], 4: [0, 90], 5: [-90, 0], 6: [90, 0] };
        const [targetX, targetY] = rotMap[result as keyof typeof rotMap];
        const startTime = performance.now();
        const diceEl = document.getElementById('dice');
        if (!diceEl) return;

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
            diceEl.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                diceEl.style.transform = `rotateX(${targetX}deg) rotateY(${targetY}deg) scale(1)`;
                if (onAnimationEnd) onAnimationEnd();
            }
        };
        requestAnimationFrame(animate);
    };

    const buildBoard = () => {
        const cells = [];
        for (let i = 1; i <= 100; i++) {
            const red = colorGroup?.red.some(x => x === i);
            const sky = colorGroup?.sky.some(x => x === i);
            const bgColor = red ? '!bg-red-200' : sky ? '!bg-sky-200' : styles.cell;
            const playersInCell = players.filter(p => p.position === i);
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
                                    alt={`Player ${player.playerId} Token`}
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

    if (isLoading) return <div className="flex justify-center items-center">로딩 중...</div>;

    if (status === 'waiting') {
        return (
            <WaitingRoom
                roomId={roomId}
                playerId={playerId}
                creatorId={creatorId}
                title={title}
                onStartGame={() => setStatus('playing')}
            />
        );
    }

    return (
        <div className={`${styles.game} min-h-screen w-full`}>
            <h1 className="text-2xl font-bold text-center my-4">{title}</h1>
            <div className="h-24 flex justify-center my-12 w-full">
                <div id="dice" className={styles.dice}>{buildDice()}</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                <div id="board" className={`${styles.board} relative w-full !bg-yellow-400 !justify-center`}>
                    {buildBoard()}
                </div>
                <div className="flex justify-center w-full gap-2 items-center mt-4">
                    {players.map(player => (
                        <button
                            key={player.playerId}
                            className={`${styles.button} ${currentRollingPlayerId === player.playerId ? styles.rolling : ''} ${currentRollingPlayerId !== null && currentRollingPlayerId !== player.playerId ? styles.disabled : ''}`}
                            onClick={() => rollDice(player.playerId)}
                            disabled={currentRollingPlayerId !== null}
                        >
                            {player.char.split('.')[0]}
                            {player.playerId === creatorId ? '(방장)'
                                : ''}
                        </button>
                    ))}
                </div>
                <div className="h-24 w-full flex justify-center">
                    {lastDiceRoll && (
                        <div className={styles.diceResultDisplay}>
                            플레이어 {players.find(p => p.playerId === lastDiceRoll.playerId)?.char.split('.')[0] || lastDiceRoll.playerId} 주사위: {lastDiceRoll.value}
                        </div>
                    )}
                </div>
                <div className="text-center">플레이어: {players.length}/4</div>
            </div>
        </div>
    );
}
