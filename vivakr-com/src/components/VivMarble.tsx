'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './VivMarble.module.css';
import Image from 'next/image';
import { db } from '@/lib/firebase/clientApp';
import { ref, onValue, off, DataSnapshot, update } from 'firebase/database';
import WaitingRoom from './WaitingRoom';
import VivTitle from './VivTitle';
import VivMarbleQnA from './VivMarbleQnA';
import { useSnackbar } from '@/lib/SnackbarContext';
import { Tooltip } from '@mui/material';

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
    avata: string;
    position: number;
    joinedAt: number;
    lastMoveTimestamp?: number;
    score: number;
    // 새로 추가: 이 플레이어가 마지막으로 QnA 처리를 완료한 이동의 타임스탬프
    lastProcessedMoveTimestamp?: number;
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
    // 중요: 점수 제출 후 게임 종료 조건 체크
    const targetScore = 500;
    const snackbar = useSnackbar();

    // QnA 다이얼로그 관리 관련 상태 및 참조
    // 다이얼로그 UI 표시 여부
    const [isQnAOpen, setIsQnAOpen] = useState(false)

    // 어떤 moveTimestamp에 대해 QnA를 열었는지 기록
    // 이 값이 null이 아니고 current player의 lastMoveTimestamp와 같으면, 해당 timestamp에 대한 QnA가 현재 열려있거나 처리 중임을 의미
    const [qnaTriggerTimestamp, setQnaTriggerTimestamp] = useState<number | null>(null);
    // QnA 처리가 완료된 (다이얼로그가 닫힌) 마지막 moveTimestamp 기록
    const [lastProcessedMoveTimestamp, setLastProcessedMoveTimestamp] = useState<number | null>(null);

    const [playerScores, setPlayerScores] = useState<{ [playerId: number]: number }>({});
    // const [turnCount, setTurnCount] = useState<number>(0);
    const [solvedQuestions, setSolvedQuestions] = useState<number[]>([]);
    const [lastDiceValue, setLastDiceValue] = useState<number>(1); // QnA에 전달할 주사위 값

    // ** 정답 메시지 표시 상태 **
    const [correctAnswerMessage, setCorrectAnswerMessage] = useState<{ show: boolean, playerId: number | null }>({ show: false, playerId: null });
    const [isLeaving, setIsLeaving] = useState(false);
    const router = useRouter();

    // Firebase roomData 리스너
    // 이 리스너는 상태 업데이트 (players, status, currentTurn 등)만 담당
    useEffect(() => {
        const roomRef = ref(db, `rooms/${roomId}`);
        const unsubscribe = onValue(roomRef, (snapshot: DataSnapshot) => {

            if (snapshot.exists()) {
                const roomData = snapshot.val();
                setStatus(roomData.status || 'waiting');
                setCreatorId(roomData.creatorId ?? -1);
                setTitle(roomData.title || '');
                setColorGroup(roomData.colorGroup || null);
                setCurrentTurn(roomData.currentTurn ?? null);
                // setTurnCount(roomData.turnCount || 0); // 턴 카운트 업데이트

                const playersData = roomData.players || {};

                const playerList: Player[] = Object.entries(playersData).map(([id, p]: [string, any]) => ({
                    playerId: Number(id),
                    char: p.char,
                    avata: p.avata,
                    position: p.position || 0,
                    // position: p.position || 1,
                    joinedAt: p.joinedAt,
                    lastMoveTimestamp: p.lastMoveTimestamp ?? null, // nullish coalescing operator 사용
                    score: p.score || 0,
                    // 타임스탬프 추가
                    lastProcessedMoveTimestamp: p.lastProcessedMoveTimestamp ?? null,
                }));

                // players 상태 업데이트
                setPlayers(playerList);

                // playerScores 상태 업데이트 (UI 표시에 사용)
                const updatedScores = playerList.reduce((acc, p) => {
                    acc[p.playerId] = p.score || 0;
                    return acc;
                }, {} as { [playerId: number]: number });
                setPlayerScores(updatedScores);
                setIsLoading(false);
                // 중요한 변경: QnA 오픈 로직은 이 리스너에서 직접 호출하지 않음
                // 대신, 업데이트된 players 상태 (특히 current player의 lastMoveTimestamp)를 감지하는
                // 별도의 useEffect에서 처리

            } else {
                setIsLoading(false);
                router.push('/odds/marble'); // 방이 없으면 리다이렉트
            }
        }, (e) => {
            snackbar.showSnackbar('방 초기화 오류.: ' + e, 'error', 'bottom', 'center', 3000);
            setIsLoading(false);
            // 에러 발생 시에도 리다이렉트 고려 가능
            router.push('/odds/marble');
        });

        return () => {
            off(roomRef, 'value', unsubscribe);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, router, playerId]);

    // 두 번째 useEffect: Firebase lastRoll 리스너 (주사위 애니메이션 트리거용)
    // 이 리스너는 주사위 굴림 정보(lastRoll)가 업데이트되었을 때 주사위 애니메이션을 실행
    useEffect(() => {
        const lastRollRef = ref(db, `rooms/${roomId}/lastRoll`);
        console.log(`[VivMarble] Setting up lastRoll listener for ${roomId}`);

        const unsubscribe = onValue(lastRollRef,
            (snapshot: DataSnapshot) => {
                console.log(`[VivMarble] lastRoll data changed.`);
                if (snapshot.exists()) {
                    const rollData = snapshot.val();
                    // rollData가 유효한지, 이미 처리한 굴림인지 확인
                    if (rollData && typeof rollData.playerId === 'number'
                        && typeof rollData.value === 'number') {
                        const rollKey = `${rollData.playerId}:${rollData.timestamp}`;

                        // lastProcessedRoll은 주사위 굴림 애니메이션 트리거를 한 번만 하기 위한 용도
                        if (rollKey !== lastProcessedRoll) {
                            console.log(`[VivMarble] New roll detected from Firebase: ${rollData.playerId}:${rollData.value}. Processing roll key: ${rollKey}`);
                            setLastDiceRoll(rollData); // UI에 직전 굴림 정보 표시

                            // animateDice 호출: 애니메이션만 실행.
                            // 이 리스너를 통한 호출에서는 moveToken 콜백을 전달하지 않음.
                            // moveToken은 버튼 클릭 이벤트에 의해 직접 호출되는 rollDice 함수 내 animateDice에서만 호출됨.
                            animateDice(
                                rollData.value, // result (주사위 값)
                                4000, // duration
                                2016, // spins
                                rollData.playerId // rollerId (누가 굴렸는지)
                                // onAnimationEnd 콜백은 여기에 전달하지 않음!
                            );

                            setLastProcessedRoll(rollKey); // 처리한 굴림 기록

                        } else {
                            console.log(`[VivMarble] Duplicate roll data received for ${rollKey}. Skipping processing.`);
                        }
                    }
                } else {
                    // lastRoll이 null이 되었을 때 (일반적으로 moveToken 성공 후 서버에서 null 처리)
                    console.log('[VivMarble] lastRoll is nullified in Firebase.');
                    // 직전 플레이어 정보 업데이트 (lastDiceRoll 상태는 직전 굴림 정보 자체를 보여줌)
                    if (lastDiceRoll) {
                        const p: Gammer = {
                            name: players.find(p => p.playerId === lastDiceRoll.playerId)?.char || '-',
                            score: lastDiceRoll.value || 0 // 굴린 값
                        }
                        setScore(p);
                    }
                }
            }, (e) => {
                snackbar.showSnackbar('[VivMarbl] LastRoll 오류.: ' + e, 'error', 'bottom', 'center', 3000);
            });

        return () => {
            console.log('[VivMarble] Cleaning up lastRoll listener.');
            off(lastRollRef, 'value', unsubscribe);
        };
        // lastProcessedRoll이 업데이트될 때만 effect가 다시 실행되도록 합니다.
        // players는 lastDiceRoll 표시를 위해 필요하지만, effect 트리거용으로는 불필요하여 제거
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, lastProcessedRoll]); // 의존성 배열: roomId, lastProcessedRoll
    // 새로운 useEffect: currentTurn 변경 시 QnA 관련 상태 초기화

    // 세 번째 useEffect: 플레이어의 마지막 이동 타임스탬프 변화를 감지하고 QnA 다이얼로그 트리거
    useEffect(() => {
        // * 현재 클라이언트의 플레이어 데이터 찾기
        const currentClientPlayer = players.find(p => p.playerId === playerId);
        const latestMoveTimestamp = currentClientPlayer?.lastMoveTimestamp ?? null; // 최신 이동 타임스탬프 (Firebase로부터)

        // ? 추가 : Firesbase 에 저장된, 마지막으로 처리된 이동 타임 스탬프
        const playerLastProcessedTimestamp = currentClientPlayer?.lastProcessedMoveTimestamp ?? null;

        // QnA를 열어야 하는 조건:
        // 1. 게임 중일 때 ('playing' 상태)
        // 2. 현재 플레이어가 현재 턴 플레이어여야 함
        // 3. 현재 플레이어 데이터가 있고, lastMoveTimestamp가 null이 아닐 때
        // 4. 이 lastMoveTimestamp가 이전에 QnA를 트리거했던 타임스탬프와 다를 때
        // 5. 이 lastMoveTimestamp가 이미 처리가 완료된 타임스탬프와 다를 때
        // 6. QnA 다이얼로그가 현재 열려있지 않을 때
        if (status === 'playing' &&
            currentTurn === playerId && // 현재 턴 플레이어인지 확인
            latestMoveTimestamp !== null &&

            latestMoveTimestamp !== playerLastProcessedTimestamp &&
            latestMoveTimestamp !== qnaTriggerTimestamp && // <-- 핵심 조건 1: 이 타임스탬프로 아직 QnA를 트리거 안 했음
            // ? 삭제..
            // latestMoveTimestamp !== lastProcessedMoveTimestamp && // <-- 핵심 조건 2: 이 타임스탬프에 대한 QnA 처리가 완료되지 않았음
            !isQnAOpen // <-- 핵심 조건 3: 다이얼로그가 현재 닫혀 있음
        ) {
            // QnA 트리거 타임스탬프 기록 및 다이얼로그 열기 상태 설정
            setQnaTriggerTimestamp(latestMoveTimestamp); // 이 타임스탬프에 대해 QnA를 열겠다!
            setIsQnAOpen(true); // 다이얼로그 UI 표시

            // IMPORTANT: 여기서 lastProcessedMoveTimestamp를 업데이트하지 않음.
            // 이는 다이얼로그가 닫힐 때 (handleQnAClose) 업데이트되어야 함.
        } else {
            console.log(`[VivMarble] QnA trigger condition NOT met. Skipping QnA open.`);
        }

    }, [players, status, playerId, currentTurn, qnaTriggerTimestamp, lastProcessedMoveTimestamp, isQnAOpen]);

    // 정답 표시
    useEffect(() => {
        if (correctAnswerMessage.show) {
            console.log('[VivMarble] Showing correct answer message.');
            const timer = setTimeout(() => {
                console.log('[VivMarble] Hiding correct answer message.');

                setCorrectAnswerMessage({ show: false, playerId: null });
            }, 5000); // 3초 후에 메시지 숨김
            return () => clearTimeout(timer);
        }
    }, [correctAnswerMessage]);

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
                router.push('/odds/marble');
            } else {
                alert(data.error || '방 삭제 실패');
            }
        } catch (err) {
            console.error('[VivMarble] Delete room error:', err);
            alert('방 삭제 중 오류 발생');
        }
    };

    const handleLeaveRoom = async () => {
        if (isLeaving) return;
        setIsLeaving(true);
        try {
            console.log('[VivMarble] Leaving room:', roomId, 'playerId:', playerId);
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'leaveRoom', roomId, playerId })
            });
            const data = await res.json();
            if (res.ok) {
                router.push('/odds/marble');
            } else {
                console.error('[VivMarble] Leave room error:', data.error);
                alert(data.error || '나가기 실패');
            }
        } catch (err) {
            console.error('[VivMarble] Leave room error:', err);
            alert('나가기 중 오류 발생');
        } finally {
            setIsLeaving(false);
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
                setSolvedQuestions([]); // 게임 재시작 시 해결한 문제 목록 초기화 필요
                setLastProcessedMoveTimestamp(null); // 처리된 타임스탬프 초기화
                setQnaTriggerTimestamp(null); // QnA 트리거 타임스탬프 초기화
                setIsQnAOpen(false); // QnA 다이얼로그 닫기
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

    // rollDice 함수: 주사위를 굴리고 서버에 알림
    const rollDice = async (playerId: number) => { // playerId 는 버튼을 누른 현재 클라이언트 ID

        // 현재 주사위를 굴리는 중이거나, 내 턴이 아니면 실행 안 함
        if (currentRollingPlayerId != null || currentTurn !== playerId) {
            console.log(`[VivMarble] rollDice blocked: currentRollingPlayerId=${currentRollingPlayerId}, currentTurn=${currentTurn}, playerId=${playerId}`);
            return;
        }

        setCurrentRollingPlayerId(playerId); // 현재 굴리는 플레이어 ID 상태 설정 (애니메이션 중 버튼 비활성화 등)

        try {
            // 서버에 주사위 굴림 요청 (결정 및 lastRoll 업데이트)
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'rollDice', roomId, playerId })
            });
            const data = await res.json();

            if (res.ok) {
                console.log(`[VivMarble] API 플레이어  ${playerId} 주사위 굴리기 성공. 주사위 결과: ${data.diceResult}`);
                // 서버에서 lastRoll 업데이트 성공. Firebase Listener (두 번째 useEffect)가 감지하고
                // animateDice를 실행할 것임.

                // 중요한 변경: animateDice 호출 시 moveToken 콜백을 여기서만 전달
                // 이 콜백은 주사위를 굴린 클라이언트에서만 실행됨
                animateDice(
                    data.diceResult, // result
                    4000, // duration
                    2016, // spins
                    playerId, // rollerId
                    () => { // onAnimationEnd callback (이 콜백은 이 rollDice 함수를 호출한 클라이언트에서만 실행)
                        // 애니메이션 종료 후 말 이동 API 호출
                        moveToken(playerId, data.diceResult);
                    });

            } else {
                alert(data.error || '주사위 굴리기 실패');
                setCurrentRollingPlayerId(null); // 에러 시 롤링 상태 해제
            }
        } catch (e: any) {
            snackbar.showSnackbar('주사위 굴리기 오류 발생: ' + e, 'error', 'bottom', 'center', 3000);
            setCurrentRollingPlayerId(null); // 에러 시 롤링 상태 해제
        }
    };

    // moveToken 함수: 말 위치 업데이트 및 lastMoveTimestamp 기록
    const moveToken = async (playerId: number, diceValue: number) => {

        try {
            // 서버에 말 이동 요청 (서버는 위치 업데이트 및 lastMoveTimestamp 기록)
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'moveToken', roomId, playerId, diceValue })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error);
            }
        } catch (err: any) {
            snackbar.showSnackbar('말 이동 중 오류 발생: ' + err.message, 'error', 'bottom', 'center', 3000);
        } finally {
            setCurrentRollingPlayerId(null);
        }
    };

    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    // animateDice 함수: 주사위 애니메이션 실행
    const animateDice = (result: number, duration: number, spins: number, rollerId: number, onAnimationEnd?: () => void) => {
        console.log(`[VivMarble] Animating dice for result ${result} (rolled by ${rollerId})`);
        const rotMap = { 1: [0, 0], 2: [0, -90], 3: [0, 180], 4: [0, 90], 5: [-90, 0], 6: [90, 0] };
        const [targetX, targetY] = rotMap[result as keyof typeof rotMap];
        const startTime = performance.now();
        const diceEl = document.getElementById('dice');
        if (!diceEl) return;

        // 애니메이션 시작 전에 주사위 보이기
        diceEl.style.display = 'block';
        diceEl.classList.remove(styles.hidden);
        diceEl.style.transform = `translate(-50%, -50%) rotateX(0deg) rotateY(0deg) scale(1)`; // 시작 위치 및 스케일 초기화

        const animate = (currentTime: number) => {
            const elapsed = (currentTime - startTime) / 1000; // 경과 시간 (초)
            const progress = Math.min(elapsed / (duration / 1000), 1); // 진행률 (0 to 1)
            const eased = easeOutQuad(progress); // 사라짐 적용

            const rotX = targetX + spins * (1 - eased); // 회전 각도 계산
            const rotY = targetY + spins * (1 - eased);

            // 애니메이션 중 스케일 효과
            let scale = 1;
            if (progress < 0.5) scale = 1 + 0.15 * (progress / 0.5); // 처음 절반은 커짐
            else if (progress < 0.75) scale = 1.15 - 0.2 * ((progress - 0.5) / 0.25); // 다음 1/4은 작아짐
            else scale = 0.95 + 0.05 * ((progress - 0.75) / 0.25); // 마지막 1/4은 원래대로

            diceEl.style.transform = `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;

            if (progress < 1) {
                requestAnimationFrame(animate); // 애니메이션 계속
            } else {
                // 애니메이션 종료 후 처리
                setTimeout(() => {
                    console.log('[VivMarble] Dice animation finished.');
                    diceEl.style.transform = `translate(-50%, -50%) scale(1)`; // 최종 스케일 적용 (혹시 모를 잔상 제거)
                    diceEl.style.display = 'none'; // 주사위 숨기기

                    // 주사위 값을 state 에 저장 (QnA 다이얼로그에 필요)
                    // 이 값은 모든 클라이언트에서 애니메이션 종료 시 설정됨
                    setLastDiceValue(result);

                    // onAnimationEnd 콜백 실행 (rollDice에서 넘어온 경우 moveToken 호출)
                    if (onAnimationEnd) {
                        console.log('[VivMarble] Executing onAnimationEnd callback.');
                        onAnimationEnd();
                    }

                }, 2000); // 애니메이션이 완전히 끝난 후 0.5초 대기
            }
        };
        requestAnimationFrame(animate); // 애니메이션 시작
    };

    // 다이얼로그 닫기 핸들러
    const handleQnAClose = async () => { // 비동기로 변경 (Firebase 업데이트 때문)

        setIsQnAOpen(false); // 다이얼로그 UI 닫기

        // QnA가 닫힐 때, 현재 플레이어의 마지막 이동 타임스탬프를 기록한다.
        // 이렇게 하면 이 타임스탬프를 가진 이동에 대해서는 QnA가 다시 열리지 않는다.
        // QnA를 트리거했던 qnaTriggerTimestamp 값을 사용한다.
        const timestampToMarkAsProcessed = qnaTriggerTimestamp;

        if (timestampToMarkAsProcessed !== null) {
            console.log(`[VivMarble] Marking move with timestamp ${timestampToMarkAsProcessed} as processed for player ${playerId} in Firebase.`);
            try {
                // Firebase에 lastProcessedMoveTimestamp 업데이트
                await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
                    lastProcessedMoveTimestamp: timestampToMarkAsProcessed
                });
                console.log(`[VivMarble] Successfully updated lastProcessedMoveTimestamp in Firebase.`);
            } catch (error) {
                console.error('[VivMarble] Error updating lastProcessedMoveTimestamp in Firebase:', error);
                // 에러 처리 (스낵바 등)
                snackbar.showSnackbar('QnA 처리 상태 저장 실패. 턴 전환에 문제가 있을 수 있습니다.', 'error', 'bottom', 'center', 5000);
            } finally {
                // Firebase 업데이트 성공/실패와 관계없이 로컬 상태 초기화
                setQnaTriggerTimestamp(null); // QnA 트리거 상태 초기화
            }

        } else {
            console.warn('[VivMarble] handleQnAClose called but qnaTriggerTimestamp is null. Cannot mark as processed.');
            // 안전 장치: qnaTriggerTimestamp가 null인 경우에도 로컬 상태 초기화
            setQnaTriggerTimestamp(null);
        }

        // IMPORTANT: QnA 처리 완료 후에만 턴을 넘긴다.
        // Firebase 업데이트가 완료될 때까지 기다렸다가 턴을 넘기도록 async/await 사용
        advanceTurn();
    };

    // 턴 넘김 API 호출
    const advanceTurn = async () => {
        console.log(`[VivMarble] Attempting to advance turn for room ${roomId}, initiated by player ${playerId}`);
        try {
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'nextTurn', roomId, playerId }), // 턴 넘김 요청
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('[VivMarble] Advance turn error:', data.error);
                alert(data.error || '턴 전환 실패');
                // 턴 전환 실패 시 QnA 상태 복원 또는 다른 처리 필요?
                // 일단 실패 시 현재 상태 유지
                return;
            }
            console.log(`[VivMarble] Advance turn successful. Next turn handled by Firebase.`);
            // Firebase 리스너가 currentTurn 업데이트를 감지하고 상태를 자동 갱신
            // turnCount 업데이트는 리스너에서 처리
            // 게임 종료 조건 체크도 리스너 또는 별도 로직에서 처리

        } catch (err) {
            console.error('[VivMarble] Advance turn fetch error:', err);
            alert('턴 전환 중 오류 발생');
        }
    };

    // 보드 셀 렌더링
    const buildBoard = () => {
        const cells = [];
        for (let i = 0; i < 100; i++) {
            const red = colorGroup?.red?.includes(i); // includes 사용
            const sky = colorGroup?.sky?.includes(i); // includes 사용
            const bgColor = red ? `${styles.cell} !bg-red-200` : sky ? `${styles.cell} !bg-sky-200` : styles.cell;
            const playersInCell = players.filter(p => p.position === i);
            cells.push(
                <div key={i} className={bgColor} id={`cell-${i}`}>
                    <span className={styles.idx}>{i}</span>
                    <div className={styles.playerContainer}>
                        {playersInCell.map((player, index) => (
                            <div key={player.playerId}
                                className={`${styles.tokenWrapper} ${currentTurn === player.playerId ? 'p-1 rounded-full bg-amber-500' : ''}`}
                                style={{ zIndex: index + 1 }}>
                                <Tooltip title={`${player.char} ${player.score} 점 ${currentTurn === player.playerId ? '현재턴' : ''}`} placement='top'>
                                    <Image
                                        className={`${styles.token} cursor-pointer`}
                                        data-player-id={player.playerId}
                                        width={30}
                                        height={30}
                                        src={`/assets/images/${player.avata}`}
                                        onClick={() => handleShowPlayerInfo(player.score, player.char)}
                                        alt=''
                                        // position 0에 있는 플레이어만 우선 로딩
                                        priority={player.position === 0 && index === 0}
                                    // priority={player.position === 1 && index === 0}
                                    />
                                </Tooltip>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return cells;
    };

    // 점수 제출 핸들러 (QnA 다이얼로그에서 호출됨)
    const onSubmitScore = async (playerId: number, score: number, qnaPosition: number) => {

        // 현재턴이 아닐 때 새로고침 방지
        if (currentTurn !== playerId) {
            // console.error(`[VivMarble] Player ${playerId} attempted to submit score, but it's not their turn (currentTurn: ${currentTurn}).`);
            // snackbar.showSnackbar('현재 턴이 아닙니다.', 'error', 'bottom', 'center', 3000);
            return;
        }
        // 플레이어 ID로 플레이어 찾기
        const targetPlayer = players.find(p => p.playerId === playerId);
        if (!targetPlayer) {
            snackbar.showSnackbar(`플레이어 ${playerId}를 찾을 수 없습니다.`, 'error', 'bottom', 'center', 3000);
            return;
        }
        // 정답 메시지 표시 로직
        if (score > 0) {
            setCorrectAnswerMessage({ show: true, playerId: playerId });
        } else {
            // '모름' 또는 오답 시 메시지 표시 안 함
            setCorrectAnswerMessage({ show: false, playerId: null });
        }
        // solvedQuestions 상태 업데이트
        setSolvedQuestions(prev => {
            // 이미 해결한 문제인지 체크하여 중복 추가 방지
            if (!prev.includes(qnaPosition)) {
                return [...prev, qnaPosition];
            }
            return prev;
        });

        // UI 상 점수 즉시 업데이트
        setPlayerScores((prev) => {
            const currentScore = prev[playerId] || 0;
            const newScore = currentScore + score;
            return {
                ...prev,
                [playerId]: newScore,
            };
        });

        try {
            // 서버에 점수 업데이트 요청
            const res = await fetch('/api/marble', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'submitScore',
                    roomId,
                    playerId,
                    score, // 추가할 점수
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('[VivMarble] Submit score API error:', data.error);
                alert(data.error || '점수 저장 실패');
                // 실패 시 UI 점수 원상복구? 복잡하니 Firebase 리스너에 의존
            } else {
                console.log('[VivMarble] Submit score API successful.');
                // Firebase 리스너가 점수 업데이트를 감지하고 playerScores 상태를 갱신할 것임
            }

            // UI에 반영된 점수 상태 (playerScores)를 기준으로 판단
            const finalScore = (playerScores[playerId] || 0) + score; // 현재 UI 점수 + 방금 얻은 점수
            const checkAns = score > 0 ? "정답" : "오답";

            const playerName = targetPlayer.char || `플레이어 ${playerId}`;
            const message = `[ ${checkAns} ] ${playerName} : 직전점수 ( ${playerScores[playerId]} ) + 취득점수 ( ${score} ) = 최종점수 ( ${finalScore}} )`;
            const messageType = score > 0 ? 'success' : 'warning';
            snackbar.showSnackbar(message, messageType, 'top', 'center', 3000);

            if (finalScore >= targetScore) {
                await update(ref(db, `rooms/${roomId}`), { status: 'ended' });
                setStatus('ended'); // UI 상태 즉시 변수
                // 게임 종료 시 턴 넘김은 하지 않음
                // handleQnAClose에서 advanceTurn을 호출하므로, 게임 종료 시 handleQnAClose가
                // advanceTurn을 호출하지 않도록 status 상태를 확인하거나, advanceTurn 내에서 게임 종료 상태를 확인해야 함.
                // advanceTurn API 단에서 게임 종료 상태면 턴을 넘기지 않도록 구현되어야 안전함.
            }

            // IMPORTANT: 여기서 advanceTurn() 호출 제거!!
            // 턴 넘김은 오직 handleQnAClose에서만 수행됩니다.

        } catch (err) {
            console.error('[VivMarble] Score submission fetch error:', err);
            alert('점수 저장 중 오류 발생');
            // 실패 시 UI 점수 원상복구? 복잡하니 Firebase 리스너에 의존
        }
    };

    // 로딩 중 표시
    if (isLoading) return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;

    // 현재 클라이언트 플레이어 정보
    const currentPlayer = players.find(p => p.playerId === playerId);

    // 게임 상태에 따른 화면 분기
    if (status === 'waiting') {
        return (
            <WaitingRoom
                roomId={roomId}
                playerId={playerId}
                creatorId={creatorId}
                title={title}
            />
        );
    }

    if (status === 'ended') {
        const sortedPlayers = [...players].sort((a, b) => (playerScores[b.playerId] || 0) - (playerScores[a.playerId] || 0));
        // snackbar.showSnackbar(`게임이 종료 되었습니다. 우승자는 ${sortedPlayers[0].char}님 입니다 축하드립니다!`, "success", "top", "center", 5000);
        return (
            <div className={`${styles.game} min-h-screen w-full flex flex-col items-center justify-center gap-4`}>
                <VivTitle title={`푸른구슬의 전설 ( ${title} ) - 게임 종료`} />
                <h2 className="text-2xl font-bold text-sky-800">최종 순위</h2>
                <div className="flex flex-col gap-2 text-slate-500 text-lg">
                    {sortedPlayers.map((p, index) => (
                        <div key={p.playerId} className="flex gap-4">
                            <span>{index + 1}위:</span>
                            <span>{p.char}</span>
                            <span>{playerScores[p.playerId] || 0}점</span>
                        </div>
                    ))}
                </div>
                {/* 방장에게만 재시작/방 삭제 버튼 표시 */}
                {playerId === creatorId && (
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleResetRoom}
                            className="bg-amber-400 text-white px-4 py-2 rounded-full hover:bg-amber-600 disabled:opacity-50"
                            disabled={currentRollingPlayerId !== null} // 롤링 중에는 버튼 비활성화
                        >
                            게임 재시작
                        </button>
                        <button
                            onClick={handleDeleteRoom}
                            className="bg-red-400 text-white px-4 py-2 rounded-full hover:bg-red-600 disabled:opacity-50"
                            disabled={currentRollingPlayerId !== null} // 롤링 중에는 버튼 비활성화
                        >
                            방 삭제
                        </button>
                    </div>
                )}
            </div>
        );
    }

    const handleShowPlayerInfo = async (score: number, name: string) => {
        const message = `${name} 님의 현재 점수는 ( ${score} )점 입니다.`;
        snackbar.showSnackbar(message, 'info', 'top', 'center', 5000);
    }

    // 게임 플레이 중 화면
    return (
        <div className={`${styles.game} min-h-screen w-full p-4`}> {/* 패딩 추가 */}
            <VivTitle title={`${title} 방`} />

            {/* 플레이어 정보 및 점수 표시 */}
            <div className="flex flex-col items-center gap-2"> {/* 간격 및 마진 추가 */}
                <div className="flex justify-center items-center gap-4 text-sky-800 font-extrabold text-3xl">
                    <span>{currentPlayer ? currentPlayer.char.toUpperCase() : '-'}</span>
                    {playerId === creatorId &&
                        <span className="text-rose-900 font-extrabold text-xs mt-auto mb-1">(방장)</span>}
                </div>

                <p className='font-bold text-slate-400 text-base'>
                    목표점수
                    <span className='text-rose-400'>
                        ( {targetScore} )
                    </span>
                    점
                </p>

                <div className="flex justify-center items-center gap-4 text-slate-500
                                text-xl bg-amber-200 border-2 border-amber-400
                                px-4 py-4 rounded-2xl"> {/* 글씨 크기 조정 */}
                    {players.map((p) => (
                        <span key={p.playerId} className={p.playerId === currentTurn ? 'text-sky-800 font-bold' : ''}> {/* 현재 턴 플레이어 강조 */}
                            {p.char}: {playerScores[p.playerId] || 0}점
                        </span>
                    ))}
                </div>
            </div>


            <div className="flex flex-col items-center justify-center">
                {/* 보드 영역 */}
                <div id="board" className={`${styles.board} relative shadow-lg shadow-slate-400
                                            border-amber-400
                                            !justify-center`}>
                    {buildBoard()}
                    {/* 주사위 애니메이션 영역 */}
                    <div id="dice" className={`${styles.dice} absolute-center`}
                        style={{ display: 'none' }}> {/* 초기에는 숨김 */}
                        {buildDice()}
                    </div>
                </div>

                {/* 게임 정보 영역 */}
                <div className="flex flex-wrap justify-center items-center text-slate-500 text-xs gap-4 h-12">
                    <span>총 플레이어 (
                        <em className='text-sky-500 mx-1 font-bold'>
                            {players.length} / 4
                        </em>
                        )</span>

                    <span>
                        현재 턴  [
                        <em className='text-sky-500 mx-1 font-bold'>
                            {currentTurn !== null ? players.find(p => p.playerId === currentTurn)?.char
                                || '알 수 없음' : '없음'}
                        </em>
                        ]
                    </span>

                    {lastDiceRoll && lastDiceRoll.playerId !== playerId && ( // 다른 플레이어의 직전 굴림 정보
                        <span>
                            직전 굴림 : [
                            <em className='text-sky-500 mx-1 font-bold'>
                                {players.find(p => p.playerId === lastDiceRoll.playerId)?.char || '-'}
                            </em>
                            ] 주사위 [
                            <em className='text-sky-500 mx-1 font-bold'>
                                {lastDiceRoll.value}
                            </em>
                            ]
                        </span>

                    )}
                    {/* !lastDiceRoll 상태는 moveToken 완료 후 발생 */}
                    {lastDiceRoll === null && score !== null && ( // 내 직전 굴림 정보 (API에서 lastRoll이 null화 된 후)
                        <span className='h-12 flex items-center px-4'>
                            내 직전 굴림 [
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

                {/* 주사위 굴리기/관리 버튼 영역 */}
                <div className="flex justify-center w-full gap-2 items-center flex-wrap"> {/* flex-wrap 추가 */}
                    {/* 각 플레이어별 주사위 굴리기 버튼 (자기 턴일 때만 활성화/표시) */}
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
                            {player.char} {player.playerId === creatorId ? '(방장)' : ''} 🎲
                        </button>
                    ))}
                    {/* 내 턴이 아니거나 롤링 중일 때 턴 정보를 보여주는 텍스트 */}
                    {(playerId !== currentTurn || currentRollingPlayerId !== null) && (
                        <span className="text-slate-500 font-bold px-4 py-2 border border-slate-300 rounded-full flex-grow sm:flex-grow-0 text-center">
                            {currentRollingPlayerId !== null ? (
                                <>
                                    주사위 굴리는 중...
                                </>
                            ) : (
                                <>
                                    [{currentTurn !== null ? players.find(p => p.playerId === currentTurn)?.char || '-' : '대기'}] 턴 입니다.
                                </>
                            )}
                        </span>
                    )}

                    {/* 방 관련 기능 */}
                    {playerId === creatorId && (
                        <>
                            <button onClick={handleDeleteRoom}
                                className="bg-red-400 text-white w-auto px-4 py-2 flex-grow sm:flex-grow-0
                                    cursor-pointer rounded-full hover:bg-red-600 disabled:opacity-50"
                                disabled={currentRollingPlayerId !== null}
                            >
                                방 삭제
                            </button>
                            <button onClick={handleResetRoom}
                                className="bg-amber-400 text-white w-auto px-4 py-2 flex-grow sm:flex-grow-0
                                    cursor-pointer rounded-full hover:bg-amber-600 disabled:opacity-50"
                                disabled={currentRollingPlayerId !== null}
                            >
                                게임 초기화
                            </button>

                        </>
                    )}

                </div>

                {/* 플레이어 순서 표시 */}
                <div className='flex gap-4 justify-evenly w-full text-slate-400 text-sm'>
                    {players
                        .sort((a, b) => a.joinedAt - b.joinedAt) // 참가 순서대로 정렬
                        .map((player, idx) => (

                            <div key={idx}
                                className={`${player.playerId === currentTurn
                                    ? 'text-cyan-600 font-extrabold bg-yellow-200 border-4'
                                    : ''}
                                flex my-4
                                flex-col
                                border-2
                                border-amber-400
                                p-8
                                rounded-full
                                justify-around
                                items-center
                                gap-4
                                `}>
                                <Image
                                    width={100}
                                    height={100}
                                    src={`/assets/images/${player.avata}`}
                                    alt={player.char}
                                    className='rounded-full w-24 h-24 cursor-pointer shadow-lg shadow-slate-700'
                                />
                                <span>
                                    {player.char}
                                </span>
                            </div>
                        ))}
                </div>
                {/* ** 추가: 정답 메시지 표시 영역 ** */}
                <div className="text-center h-auto w-full
                fixed top-1/2
                 flex items-center justify-center"> {/* 메시지 표시 공간 확보 */}
                    {(correctAnswerMessage.show && correctAnswerMessage.playerId !== null) && (
                        <span className={`text-red-700
                        animate-bounce font-extrabold text-7xl ${styles.fadeInOut}`}>
                            정답입니다!!!
                        </span>
                    )}
                </div>


                <div className='flex flex-col rounded-full border-2 border-slate-300 px-8 py-4 w-full mt-2 mb-12'>
                    <p className='text-xs text-sky-600 font-bold'>
                        최종 점수 = (푸른색(15) 또는 빨간색(5), 무색(10)) 칸 * (주사위 숫자) 과 (최고 점수 50) 점 사이에 (최소값)이 (최종 점수)가 됩니다.
                    </p>
                    <p className='text-xs text-sky-600 font-bold'>
                        다만 주사위 1과 2가 나오면 위로 점수 5점이 추가됩니다. 즉, 정답을 맞추었을 시 최저 점수는 15점이 됩니다.
                    </p>

                </div>
                {playerId !== creatorId && (
                    <button
                        onClick={handleLeaveRoom}
                        className="bg-orange-500 text-white w-auto mb-96 px-4 py-2 flex-grow sm:flex-grow-0
                                cursor-pointer rounded-full hover:bg-orange-600 disabled:opacity-50"
                        disabled={isLeaving || currentRollingPlayerId !== null}
                    >
                        나가기
                    </button>
                )}

                {/* QnA 다이얼로그 렌더링 */}
                {/* QnA는 status가 playing이고 isQnAOpen 상태가 true일 때만 표시 */}
                {/* qna는 현재 플레이어의 위치를 사용 */}
                {/* solvedQuestions는 QnA 컴포넌트 내에서 이미 풀었는지 판단하는 데 사용될 수 있음 */}
                {status === 'playing' && currentPlayer?.position && (
                    <VivMarbleQnA
                        qna={currentPlayer?.position} // 현재 플레이어의 위치를 문제 번호로 사용
                        open={isQnAOpen} // 이 state가 true일 때만 다이얼로그 열림
                        onClose={handleQnAClose} // 다이얼로그 닫기 핸들러
                        roomId={roomId}
                        diceValue={lastDiceValue} // 저장해둔 주사위 값 전달
                        playerId={playerId} // 현재 클라이언트의 플레이어 ID 전달
                        onSubmitScore={onSubmitScore} // 점수 제출 핸들러
                        colorGroup={colorGroup} // 색상 그룹 정보
                        solvedQuestions={solvedQuestions} // 이미 해결한 문제 목록
                    />
                )}
            </div>
        </div >
    );
}
