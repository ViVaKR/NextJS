
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
    score: number;
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
    const [lastDiceRoll, setLastDiceRoll] = useState<LastDiceInfo | null>(null);
    const [colorGroup, setColorGroup] = useState<ColorGroups | null>(null);
    const [status, setStatus] = useState<'waiting' | 'playing' | 'ended'>('waiting');
    const [creatorId, setCreatorId] = useState<number>(-1);
    const [title, setTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [lastProcessedRoll, setLastProcessedRoll] = useState<string | null>(null);
    const [currentTurn, setCurrentTurn] = useState<number | null>(null);
    const [score, setScore] = useState<Gammer | null>(null);
    const [isQnAOpen, setIsQnAOpen] = useState(false);
    const [playerScores, setPlayerScores] = useState<{ [playerId: number]: number }>({});
    const [turnCount, setTurnCount] = useState<number>(0);
    const [solvedQuestions, setSolvedQuestions] = useState<number[]>([]);
    const [lastDiceValue, setLastDiceValue] = useState<number>(1);
    const [lastProcessedMoveTimestamp, setLastProcessedMoveTimestamp] = useState<number | null>(null);
    const router = useRouter();

    // 첫 번째 useEffect: Firebase roomData 리스너 (수정)
    useEffect(() => {
        const roomRef = ref(db, `rooms/${roomId}`);
        console.log(`[VivMarble] Setting up room listener for ${roomId}`);
        const unsubscribe = onValue(roomRef, (snapshot: DataSnapshot) => {
            console.log(`[VivMarble] Room data changed.`);
            if (snapshot.exists()) {
                const roomData = snapshot.val();
                setStatus(roomData.status || 'waiting');
                setCreatorId(roomData.creatorId ?? -1);
                setTitle(roomData.title || '');
                setColorGroup(roomData.colorGroup || null);
                setCurrentTurn(roomData.currentTurn ?? null);
                setTurnCount(roomData.turnCount || 0);
                const playersData = roomData.players || {};
                const playerList: Player[] = Object.entries(playersData).map(([id, p]: [string, any]) => ({
                    playerId: Number(id),
                    char: p.char,
                    position: p.position || 1,
                    joinedAt: p.joinedAt,
                    lastMoveTimestamp: p.lastMoveTimestamp,
                    score: p.score || 0 // score 필드도 추가
                }));

                setPlayers(playerList); // <-- players state 업데이트

                const updatedScores = playerList.reduce((acc, p) => {
                    acc[p.playerId] = p.score || 0;
                    return acc;
                }, {} as { [playerId: number]: number });
                setPlayerScores(updatedScores);

                setIsLoading(false);

                // ** 여기서 QnA 다이얼로그 오픈 로직 처리 **
                const currentClientPlayerFromList = playerList.find(p => p.playerId === playerId);

                if (currentClientPlayerFromList && currentClientPlayerFromList.lastMoveTimestamp !== undefined) {
                    const latestMoveTimestamp = currentClientPlayerFromList.lastMoveTimestamp;

                    // 최신 이동 타임스탬프가 있고,
                    // 이 타임스탬프가 이전에 QnA를 처리했던 타임스탬프와 다르고,
                    // 현재 QnA 다이얼로그가 열려있지 않으면 -> 다이얼로그를 연다.
                    if (latestMoveTimestamp !== lastProcessedMoveTimestamp && !isQnAOpen) {
                        console.log(`[VivMarble] Player ${playerId}'s lastMoveTimestamp updated to ${latestMoveTimestamp}. Last processed: ${lastProcessedMoveTimestamp}. Opening QnA.`);
                        setIsQnAOpen(true);
                        // lastProcessedMoveTimestamp는 다이얼로그가 닫힐 때 업데이트합니다.
                    } else {
                        console.log(`[VivMarble] Player ${playerId}'s lastMoveTimestamp is ${latestMoveTimestamp}. Last processed: ${lastProcessedMoveTimestamp}. isQnAOpen: ${isQnAOpen}. Not opening QnA.`);
                    }
                } else {
                    console.log(`[VivMarble] Player ${playerId} not found or lastMoveTimestamp is undefined. Skipping QnA open check.`);
                }


            } else {
                console.log(`[VivMarble] Room ${roomId} does not exist.`);
                setIsLoading(false);
                router.push('/games/marble');
            }
        }, (e) => {
            console.error('[VivMarble] Room listener error:', e);
            setIsLoading(false);
        });

        return () => {
            console.log('[VivMarble] Cleaning up room listener.');
            off(roomRef, 'value', unsubscribe);
        };
        // players 상태 변화 때문에 이 Effect가 다시 실행되는 것을 방지하기 위해 players를 의존성 배열에서 제거
        // isQnAOpen은 QnA 오픈 후 다시 조건을 체크하지 않도록 필요합니다.
        // lastProcessedMoveTimestamp는 새로운 이동을 감지하는 기준으로 사용되므로 필요합니다.
    }, [roomId, router, isQnAOpen, playerId, lastProcessedMoveTimestamp]); // 의존성 배열 수정

    // 두 번째 useEffect: Firebase lastRoll 리스너 (수정)
    useEffect(() => {
        const lastRollRef = ref(db, `rooms/${roomId}/lastRoll`);
        console.log(`[VivMarble] Setting up lastRoll listener for ${roomId}`);
        const unsubscribe = onValue(lastRollRef,
            (snapshot: DataSnapshot) => {
                console.log(`[VivMarble] lastRoll data changed.`);
                if (snapshot.exists()) {
                    const rollData = snapshot.val();
                    if (rollData && typeof rollData.playerId === 'number' && typeof rollData.value === 'number') {
                        const rollKey = `${rollData.playerId}:${rollData.timestamp}`;

                        if (rollKey !== lastProcessedRoll) {
                            console.log(`[VivMarble] New roll detected from Firebase: ${rollData.playerId}:${rollData.value}. Processing roll key: ${rollKey}`);
                            setLastDiceRoll(rollData); // <-- lastDiceRoll 상태 업데이트 (직전 플레이어 정보 표시에 사용)
                            setLastProcessedRoll(rollKey);

                            // Firebase Listener에서 animateDice 호출: 애니메이션만 실행
                            // onAnimationEnd 콜백은 비워둡니다. moveToken은 rollDice에서 호출됩니다.
                            animateDice(
                                rollData.value, // result
                                4000, // duration
                                2160, // spins
                                rollData.playerId, // rollerId
                                () => { // onAnimationEnd callback (이 콜백은 모든 클라이언트에서 실행됨)
                                    console.log(`[VivMarble] animateDice callback finished for roller ${rollData.playerId} on client ${playerId} (from useEffect listener).`);
                                    // ** 중요: 여기서 moveToken을 호출하지 않습니다. **
                                    // moveToken 호출은 rollDice 함수에서만 이루어집니다.
                                    // 다이얼로그를 여는 로직은 이제 첫 번째 useEffect로 이동했습니다.
                                });
                        } else {
                            console.log(`[VivMarble] Duplicate roll data received for ${rollKey}. Skipping processing.`);
                        }
                    }
                } else {
                    // lastRoll이 null이 되었을 때 (moveToken 성공 후)
                    console.log('[VivMarble] lastRoll is nullified in Firebase.');
                    const p: Gammer = {
                        name: players.find(p => p.playerId === lastDiceRoll?.playerId)?.char.split('.')[0] || '-',
                        score: lastDiceRoll?.value || 0
                    }
                    setScore(p);
                }
            }, (e) => {
                console.error('[VivMarble] LastRoll listener error:', e);
            });
        return () => {
            console.log('[VivMarble] Cleaning up lastRoll listener.');
            off(lastRollRef, 'value', unsubscribe);
        };
        // lastProcessedRoll이 업데이트될 때만 effect가 다시 실행되도록 합니다.
        // players 상태 변화 때문에 이 Effect가 다시 실행되는 것을 방지하기 위해 players를 의존성 배열에서 제거
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, lastProcessedRoll]); // 의존성 배열은 그대로 유지

    const handleDeleteRoom = async () => {

        if (!confirm('정말로 이 방을 삭제하시겠습니까?')) {
            return;
        }
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deleteRoom', roomId, playerId })
            });
            const data = await res.json();
            if (res.ok) {
                router.push('/games/marble');
            } else {
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
                body: JSON.stringify({ action: 'resetGame', roomId, playerId })
            });
            const data = await res.json();
            if (res.ok) {
                console.log('[VivMarble] Reset room:', roomId);
                setPlayerScores({});
                setTurnCount(0);
                setSolvedQuestions([]);
                // 상태는 Firebase 리스너가 자동 갱신
            } else {
                alert(data.error || '방 초기화 실패');
            }
        } catch (err) {
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
    }

    const rollDice = async (playerId: number) => { // playerId 는 버튼을 누른 현재 클라이언트 ID

        if (currentRollingPlayerId != null || currentTurn !== playerId) return;

        setCurrentRollingPlayerId(playerId); // 현재 굴리는 플레이어 ID 상태 설정

        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'rollDice', roomId, playerId })
            });
            const data = await res.json();

            if (res.ok) {
                // 서버에서 lastRoll 업데이트 성공 -> Firebase Listener가 감지하고 animateDice 실행
                // 여기서 setLastDiceRoll을 직접 호출해도 되지만, Firebase listener가 감지하여
                // 상태를 업데이트하는 것이 데이터 일관성에 더 좋습니다.
                // setLastDiceRoll({ playerId, value: data.diceResult, timestamp: Date.now() });
                // setLastDiceRoll({ playerId, value: data.diceResult, timestamp: Date.now() });

                // animateDice 호출 시, 주사위를 굴린 플레이어의 클라이언트에서만 moveToken을 호출하는 콜백 전달
                // 이 호출은 위 useEffect에 의한 호출과 별개로, 버튼 클릭 이벤트에 의해 발생합니다
                console.log(`[VivMarble] API rollDice successful for player ${playerId}. Dice result: ${data.diceResult}`);
                // animateDice 호출 시, diceResult 값을 5번째 인자로 전달하면 안 됩니다.
                // animateDice의 5번째 인자는 onAnimationEnd 콜백 함수입니다.

                animateDice(
                    data.diceResult, // result
                    4000, // duration
                    2016, //spins (useEffedt 와 다를 수 있음, 조정 필요)
                    playerId, // roolerId (현재 버튼을 누른 플레이어 ID)
                    () => { // onAnimationEnd callback (이 콜백은 현재 클라이언트에서만 실행됨)

                        // ** 중요 : 여기서 moveToken 을 호출
                        moveToken(playerId, data.diceResult);
                    });
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            alert('주사위 굴리기 실패');
        } finally {
            // setCurrentRollingPlayerId(null);
        }
    };

    const moveToken = async (playerId: number, diceValue: number) => {
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'moveToken', roomId, playerId, diceValue }) // 서버에 말 이동 및 턴 넘김 요청
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error);
            }
            // moveToken API 성공 후 Firebase 데이터가 업데이트되고, main useEffect가 이를 감지하여 state를 업데이트합니다.
        } catch (err) {
            alert('말 이동 중 오류 발생');
        } finally {
            // 이동 및 턴 넘김 API 호출 오나료 후 rolling 상태 해제
            setCurrentRollingPlayerId(null);
        }
    };

    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    // animateDice 함수 (매개변수 정의 및 내부 로직)
    const animateDice = (result: number, duration: number, spins: number, rollerId: number, onAnimationEnd?: () => void) => {
        const rotMap = { 1: [0, 0], 2: [0, -90], 3: [0, 180], 4: [0, 90], 5: [-90, 0], 6: [90, 0] };
        const [targetX, targetY] = rotMap[result as keyof typeof rotMap];
        const startTime = performance.now();
        const diceEl = document.getElementById('dice');
        if (!diceEl) return;

        diceEl.classList.remove(styles.hidden);
        diceEl.style.display = 'block'; // 명시적 표시

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

                    // 주사위 값을 state 에 저장 (다이얼로그에 필요)
                    setLastDiceValue(result);

                    // 애니메이션 완료 후 콜백 실행 (rollDice에서 넘어온 경우 moveToken 호출)
                    if (onAnimationEnd) {
                        onAnimationEnd();
                    } else {
                        // useEffect에서 넘어온 경우 (다른 플레이어의 애니메이션)

                    }

                }, 1000); // 애니메이션이 완전히 끝난 후 1초 대기
            }
        };
        requestAnimationFrame(animate);
    };

    // 다이얼로그 닫기 핸들러
    const handleQnAClose = () => {
        setIsQnAOpen(false);

        // QnA가 닫힐 때, 현재 플레이어의 마지막 이동 타임스탬프를 기록한다.
        // 이렇게 하면 이 타임스탬프를 가진 이동에 대해서는 QnA가 다시 열리지 않는다.
        const playerAfterMove = players.find(p => p.playerId === playerId);
        if (playerAfterMove?.lastMoveTimestamp !== undefined) { // null이 아닌 경우에만 기록
            setLastProcessedMoveTimestamp(playerAfterMove.lastMoveTimestamp);
        } else {
            // 예외 상황 처리: 혹시 lastMoveTimestamp가 undefined면 null로 초기화
            setLastProcessedMoveTimestamp(null);
        }
        advanceTurn(); // 턴 넘김 API 호출
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

            await update(ref(db, `rooms/${roomId}`),
                { turnCount: newTurnCount });

            if (newTurnCount >= 50) {
                setStatus('ended');
                await update(ref(db, `rooms/${roomId}`), { status: 'ended' });
            }
        } catch (err) {
            console.error('[VivMarble] Advance turn error:', err);
            alert('턴 전환 중 오류 발생');
        }
    };

    const buildBoard = () => {
        const cells = [];
        for (let i = 1; i <= 100; i++) {
            const red = colorGroup?.red.some(x => x === i);
            const sky = colorGroup?.sky.some(x => x === i);
            const bgColor = red ? `${styles.cell} !bg-red-200` : sky ? `${styles.cell} !bg-sky-200` : styles.cell;
            const playersInCell = players.filter(p => p.position === i);
            cells.push(
                <div key={i} className={bgColor} id={`cell-${i}`}>
                    <span className={styles.idx}>{i}</span>
                    <div className={styles.playerContainer}>
                        {playersInCell.map((player, index) => (
                            <div key={player.playerId}
                                className={styles.tokenWrapper} style={{ zIndex: index + 1 }}>
                                <Image
                                    className={styles.token}
                                    data-player-id={player.playerId}
                                    width={30}
                                    height={30}
                                    src={`/assets/images/${player.char}`}
                                    alt=''
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
                await update(ref(db, `rooms/${roomId}`),
                    { status: 'ended' });
                return; // 게임 종료시 턴 넘기지 않음
            }

            // ** 중요: 여기서 advanceTurn() 호출 제거 **
            // 턴 넘김은 handleQnAClose 에서만 수행됩니다.
            // await advanceTurn(); // <-- 이 줄을 제거하거나 주석 처리
        } catch (err) {
            console.error('[VivMarble] Score submission error:', err);
            alert('점수 저장 중 오류 발생');
        }
    };

    if (isLoading) return <div className="flex justify-center items-center">로딩 중...</div>;

    const currentPlayer = players.find(p => p.playerId === playerId);

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

    return (
        <div className={`${styles.game} min-h-screen w-full`}>
            <VivTitle title={`푸른구슬의 전설 ( ${title} )`} />

            <div className="flex justify-center items-center gap-4 text-sky-800 font-extrabold text-3xl">
                {currentPlayer ? currentPlayer.char.split('.')[0].toUpperCase() : '-'}
                {playerId === creatorId &&
                    <span className="text-rose-300 font-extrabold text-xs mt-auto mb-1">방장</span>}
            </div>

            <div className="flex justify-center items-center gap-4 text-slate-500 text-xs">
                {players.map((p) => (
                    <span key={p.playerId}>
                        {p.char.split('.')[0]}: {playerScores[p.playerId] || 0}점
                    </span>
                ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
                {/* 보드영역 */}
                <div id="board" className={`${styles.board}
                relative w-full
                !justify-center`}>
                    {buildBoard()}
                    <div id="dice" className={`${styles.dice} absolute-center`}>
                        {buildDice()}
                    </div>
                </div>
                <div className="flex justify-center items-center text-slate-500 text-xs gap-4 h-12">
                    <span>총 플레이어 (
                        <em className='text-sky-500 mx-2 font-bold'>
                            {players.length} / 4
                        </em>
                        )</span>

                    <span>
                        현재 턴  [
                        <em className='text-sky-500 mx-2 font-bold'>
                            {currentTurn !== null ? players.find(p => p.playerId === currentTurn)?.char.split('.')[0]
                                || '알 수 없음' : '없음'}
                        </em>
                        ]

                    </span>

                    {lastDiceRoll && (
                        <span>
                            현재 플레이어 : {players.find(p => p.playerId === lastDiceRoll.playerId)?.char.split('.')[0] || lastDiceRoll.playerId}
                        </span>

                    )}
                    {!lastDiceRoll && (
                        <span className='h-12 flex items-center px-4'>
                            직전 플레이어 [
                            <em className='text-sky-500 mx-2 font-bold'>
                                {score?.name}
                            </em>
                            ] 의 주사위 숫자 [
                            <em className='text-sky-500 mx-2 font-bold'>
                                {score?.score}
                            </em>
                            ]
                        </span>
                    )}
                </div>
                <div className="flex justify-center w-full gap-2 items-center">
                    {players.map(player => (
                        <button
                            key={player.playerId}
                            className={`${styles.button} !w-full
                            ${currentRollingPlayerId === player.playerId
                                    ? styles.rolling : ''}

                                ${currentTurn !== player.playerId ? styles.disabled : ''}`}

                            onClick={() => rollDice(player.playerId)}
                            disabled={playerId !== currentTurn}
                            hidden={currentTurn !== player.playerId || currentRollingPlayerId !== null}
                        >
                            {player.char.split('.')[0]} {player.playerId === creatorId ? '(방장)' : ''} {currentTurn === player.playerId ? '(턴)' : ''}
                        </button>
                    ))}
                    {playerId === creatorId && (
                        <>
                            <button onClick={handleDeleteRoom}
                                className="bg-red-400 text-white w-48 px-4 py-2
                                    cursor-pointer rounded-full hover:bg-red-600" >
                                방 삭제
                            </button>
                            <button onClick={handleResetRoom}
                                className="bg-amber-400 text-white w-48 px-4 py-2
                                    cursor-pointer rounded-full hover:bg-amber-600" >
                                방 갱신
                            </button>
                        </>
                    )}
                </div>
                <div className='flex gap-4 justify-evenly w-full text-slate-400'>
                    {players.map((player, idx) => (
                        <span key={idx} className={player.playerId === currentTurn ? 'text-red-400 font-extrabold' : ''} >
                            {player.char.split('.')[0]}
                        </span>
                    ))}
                </div>

                {currentPlayer?.position && status === 'playing' && (
                    <VivMarbleQnA
                        qna={currentPlayer?.position} // 현재 플레이어의 위치를 문제 번호로 사용
                        open={isQnAOpen} // 이 state가 true일 때만 다이얼로그 열림
                        onClose={handleQnAClose} // 다이얼로그 닫기 핸들러
                        roomId={roomId}
                        diceValue={lastDiceValue} // 저장해둔 주사위 값 전달
                        playerId={playerId} // 현재 클라이언트의 플레이어 ID 전달
                        onSubmitScore={onSubmitScore}
                        colorGroup={colorGroup}
                        solvedQuestions={solvedQuestions}
                    />
                )}
            </div>
        </div >
    );
}
