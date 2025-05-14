'use client';

import { useState, useEffect } from 'react';
import styles from './BlueMarble.module.css';
import Image from 'next/image';
import { db } from '@/lib/firebase/clientApp';
import { ref, onValue, off, DataSnapshot } from 'firebase/database';

interface ColorGroups {
    sky: number[];
    red: number[];
}

type LastDiceInfo = {
    value: number;
    timestamp: any;
    playerId: number;
}

type Player = {
    id: number;
    position: number;
    char: string;
    lastDice?: LastDiceInfo | null;
    lastMoveTimestamp?: number | null;
};

type PlayerChar = {
    id: number;
    name: string;
    isCreator: boolean;
};

type Players = { [key: number]: Player };

const GAME_Id = 'BlueMarble';

export default function BlueMarble({ currentPlayerId = 0 }: { currentPlayerId?: number }) {
    const [players, setPlayers] = useState<Players>({});
    const [currentRollingPlayerId, setCurrentRollingPlayerId] = useState<number | null>(null);
    const [lastDiceRoll, setLastDiceRoll] = useState<{ playerId: number, value: number } | null>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [colorGroup, setColorGroup] = useState<ColorGroups>();
    const [isLoading, setIsLoading] = useState(true);
    const [lastProcessedRoll, setLastProcessedRoll] = useState<string | null>(null);

    const playerChars: PlayerChar[] = [
        { id: 0, name: "vivakr.webp", isCreator: true },
        { id: 1, name: "smile.webp", isCreator: false },
        { id: 2, name: "man.webp", isCreator: false },
        { id: 3, name: "buddha.webp", isCreator: false }
    ];

    useEffect(() => {
        const gameRef = ref(db, `games/${GAME_Id}`);
        const unsubscribe = onValue(
            gameRef,
            (snapshot: DataSnapshot) => {
                if (snapshot.exists()) {
                    const gameData = snapshot.val();
                    if (gameData.players) {
                        const formatted = formatPlayerData(gameData.players);
                        setPlayers(formatted);
                    } else {
                        setPlayers({});
                    }

                    if (gameData.colorGroup) {
                        setColorGroup(gameData.colorGroup);
                    } else {
                        setColorGroup(undefined);
                    }
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            },
            (e) => {
                setIsLoading(false);
            }
        );

        return () => {
            off(gameRef);
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [GAME_Id]);

    useEffect(() => {
        const lastRollRef = ref(db, `games/${GAME_Id}/lastRoll`);
        const unsubscribe = onValue(
            lastRollRef,
            (snapshot: DataSnapshot) => {
                if (snapshot.exists()) {
                    const rollData = snapshot.val();

                    if (rollData && typeof rollData.playerId === 'number' && typeof rollData.value === 'number') {
                        const rollKey = `${rollData.playerId}:${rollData.timestamp}`;
                        if (rollKey !== lastProcessedRoll) {
                            setLastDiceRoll({
                                playerId: rollData.playerId,
                                value: rollData.value
                            });
                            setLastProcessedRoll(rollKey);

                            animateDice(rollData.value, 2000, 1080, rollData.playerId);
                        } else {
                            console.log('[LastRoll Listener] Skipping duplicate roll:', rollKey);
                        }
                    } else {
                        console.warn('[LastRoll Listener] Invalid roll data:', rollData);
                    }
                } else {
                    console.log('[LastRoll Listener] lastRoll is null');
                    setLastDiceRoll(null);
                }
            },
            (e) => {
                console.error('[LastRoll Listener] Error:', e);
            }
        );

        console.log('[LastRoll Listener] Subscribed');
        return () => {
            off(lastRollRef);
            unsubscribe();
            console.log('[LastRoll Listener] Unsubscribed');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastProcessedRoll]);

    useEffect(() => {
        const initializeGameOnServer = async () => {
            try {
                await fetch('/api/firebase', { method: 'GET' });
            } catch (err) {
                console.error('[InitializeGame] Error:', err);
            }
        };
        initializeGameOnServer();
        // setColorGroup(getColoredRandomNumbers(100));
    }, []);

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
                <div
                    key={f}
                    className={`${styles.face} ${styles[`face-${f}`]}`}
                    data-face={f}
                >
                    {pips}
                </div>
            );
        }
        return faces;
    };

    const moveToken = async (playerId: number, diceValue: number) => {
        try {
            console.log(`[MoveToken] Requesting for player ${playerId}, diceValue=${diceValue}`);
            const res = await fetch(`/api/firebase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'moveToken', playerId, diceValue }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            console.log(`[MoveToken] Player ${playerId} moved to position ${data.newPosition}`);
        } catch (err) {
            console.error(`[MoveToken] 오류 (플레이어 ${playerId}):`, err);
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
        const rotMap = {
            1: [0, 0],
            2: [0, -90],
            3: [0, 180],
            4: [0, 90],
            5: [-90, 0],
            6: [90, 0]
        };

        const [targetX, targetY] = rotMap[result as keyof typeof rotMap];

        const startTime = performance.now();
        const diceEl = document.getElementById('dice');

        if (!diceEl) {
            console.error('[AnimateDice] Dice element not found');
            return;
        }

        console.log(`[AnimateDice] Starting for player ${playerId}, result=${result}`);

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
                console.log(`[AnimateDice] Completed for player ${playerId}`);
                if (onAnimationEnd) {
                    onAnimationEnd();
                }
            }
        };
        requestAnimationFrame(animate);
    };

    const rollDice = async (playerId: number) => {
        if (currentRollingPlayerId != null) {
            console.log(`[RollDice] Already rolling, ignoring for player ${playerId}`);
            return;
        }
        setCurrentRollingPlayerId(playerId);
        console.log(`[RollDice] Starting for player ${playerId}`);

        try {
            const res = await fetch(`/api/firebase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'rollDice', playerId })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            console.log(`[RollDice] Server response:`, data);
            setLastDiceRoll({ playerId, value: data.diceResult });
            animateDice(data.diceResult, 2000, 1080, playerId, () => {
                moveToken(playerId, data.diceResult);
            });
        } catch (err) {
            console.error(`[RollDice] 오류 (플레이어 ${playerId}):`, err);
        } finally {
            setCurrentRollingPlayerId(null);
            console.log(`[RollDice] Completed for player ${playerId}`);
        }
    };

    const handleResetGame = async () => {
        if (isResetting || currentRollingPlayerId != null) {
            console.log('[ResetGame] Resetting or rolling, ignoring');
            return;
        }
        setIsResetting(true);
        // setColorGroup(getColoredRandomNumbers(100));

        try {
            const res = await fetch('/api/firebase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'resetGame' })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP 에러! Status: ${res.status}`);
            }
            console.log('[ResetGame] Server reset completed');
        } catch (err: any) {
            console.error('[ResetGame] 게임 리셋 오류:', err);
        } finally {
            setIsResetting(false);
            setCurrentRollingPlayerId(null);
            setLastDiceRoll(null);
            setLastProcessedRoll(null);
            console.log('[ResetGame] Reset completed');
        }
    };

    const formatPlayerData = (firebaseData: any): Players => {
        const formattedPlayers: Players = {};
        if (!firebaseData) return formattedPlayers;
        for (const key in firebaseData) {
            const id = parseInt(key, 10);
            if (!isNaN(id) && playerChars.some(p => p.id === id)) {
                const position = firebaseData[key].position !== undefined ? firebaseData[key].position : 1;
                formattedPlayers[id] = {
                    ...firebaseData[key],
                    id: id,
                    position: position,
                    lastDice: firebaseData[key].lastDice || null,
                    lastMoveTimestamp: firebaseData[key].lastMoveTimestamp || null
                };
            }
        }
        return formattedPlayers;
    };

    if (isLoading) return <div className="flex justify-center items-center">게임 데이터 로딩 중</div>;

    const buildBoard = () => {
        const cells = [];
        for (let i = 1; i <= 100; i++) {
            const red = colorGroup?.red.some(x => x === i);
            const sky = colorGroup?.sky.some(x => x === i);
            const bgColor = (red ? '!bg-red-200' : (sky ? '!bg-sky-200' : `${styles.cell}`));

            const playersInCell = Object.values(players).filter(p => p.position === i);

            cells.push(
                <div key={i} className={`${bgColor}`} id={`cell-${i}`}>
                    <span className={styles.idx}>{i}</span>
                    <div className={styles.playerContainer}>
                        {playersInCell.map((player, index) => (
                            <div key={player.id} className={styles.tokenWrapper} style={{ zIndex: index + 1 }}>
                                <Image
                                    className={styles.token}
                                    data-player-id={player.id}
                                    width={30}
                                    height={30}
                                    src={`/assets/images/${player.char}`}
                                    alt={`Player ${player.id} Token`}
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

    const playerCount = Object.keys(players).length;
    const isCreator = currentPlayerId === 0;
    const canReset = isCreator && playerCount > 1;

    return (
        <div className={`${styles.game} min-h-screen w-full`}>
            <div className='h-24 flex justify-center my-12 w-full'>
                <div id="dice" className={styles.dice}>
                    {buildDice()}
                </div>
            </div>
            <div className='flex flex-col items-center justify-center gap-4'>
                <div id="board" className={`${styles.board} relative w-full !bg-yellow-400 !justify-center`}>
                    {buildBoard()}
                </div>
                <div className='flex justify-center w-full gap-2 items-center mt-4'>
                    {playerChars.map(player => (
                        <button
                            key={player.id}
                            className={`${styles.button}
                                ${currentRollingPlayerId === player.id ? styles.rolling : ''}
                                ${currentRollingPlayerId !== null && currentRollingPlayerId !== player.id ? styles.disabled : ''}`}
                            onClick={() => rollDice(player.id)}
                            disabled={currentRollingPlayerId !== null}
                        >
                            {player.name.split('.')[0]}
                            {player.isCreator ? ' (방장)' : ''}
                        </button>
                    ))}
                    {isCreator && (
                        <button
                            className={`${styles.button}
                            ${styles.resetButton}
                            ${!canReset ? 'disabled' : ''}
                            `}
                            onClick={handleResetGame}
                            disabled={isResetting
                                || !canReset
                                || currentRollingPlayerId !== null}
                        >
                            {isResetting ? '초기화 중...' : '게임 시작'}
                        </button>
                    )}
                </div>
                <div className='h-24 w-full flex justify-center'>
                    {lastDiceRoll && (
                        <div className={styles.diceResultDisplay}>
                            플레이어 {lastDiceRoll.playerId + 1} 주사위: {lastDiceRoll.value}
                        </div>
                    )}
                </div>
                <div className='text-center'>
                    현재 플레이어: {playerCount}/4
                    {!canReset && isCreator && (
                        <p className='text-red-500'>2명 이상 4명 모두 참여해야 게임을 시작할 수 있습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
