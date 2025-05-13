'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './VivBlueMarble.module.css';
import Image from 'next/image';

type Player = {
    id: number; // 플레이어 ID 추가
    position: number;
    char: string;
    lastDice?: number | null;
};
type Players = { [key: number]: Player };

const parsePx = (value: string | null): number => {
    if (!value) return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
};

export default function VivBlueMarble() {
    const [players, setPlayers] = useState<Players>({});
    const [diceResult, setDiceResult] = useState<number | null>(null);
    const [isRolling, setIsRolling] = useState<number | null>(null); // 어떤 플레이어가 굴리는 중인지 ID 저장
    const [isResetting, setIsResetting] = useState(false); // 리셋 중 상태 추가

    const boardDimensions = useRef({
        cellWidth: 0,
        cellHeight: 0,
        columnGap: 0,
        rowGap: 0,
        paddingTop: 0, // 보드 패딩 추가
        paddingLeft: 0 // 보드 패딩 추가
    });
    const [isBoardReady, setIsBoardReady] = useState(false); // 보드 차원 계산 완료 플래그

    const playerChars = [ // API와 동일하게 컴포넌트에도 정보 유지 (ID 매핑용)
        { id: 0, name: "믿어핑.jpg" },
        { id: 1, name: "방글핑.jpg" },
        { id: 2, name: "패션핑.jpg" },
        { id: 3, name: "하츄핑.jpg" }
    ];

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await fetch('/api/firebase', { method: 'GET' });
                if (!res.ok) {
                    throw new Error(`HTTP 에러! Status: ${res.status}`);
                }
                const data = await res.json();

                if (data.players) {
                    setPlayers(formatPlayerData(data.players));
                } else {
                    setPlayers(formatPlayerData(null));
                }
            } catch (err) {
                console.error('[GameBoard] 초기 데이터 로드 오류 오류:', err);
            }
        };
        fetchInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 빈 의존성 배열로 마운트 시 1회 실행

    /*
        useEffect(() => {
            let animationFrameId: number;
            const measureBoard = () => {
                const boardElement = document.getElementById('board');
                const cellElement = boardElement?.querySelector(`.${styles.cell}`) as HTMLElement;

                if (boardElement && cellElement) {
                    const computedStyle = getComputedStyle(boardElement);
                    const cellComputedStyle = getComputedStyle(cellElement);

                    // CSS 변수 읽기
                    const rootStyle = getComputedStyle(document.documentElement);
                    const boardSize = parsePx(rootStyle.getPropertyValue('--board-size')) || 60;

                    // 셀 크기
                    const cellWidth = parsePx(cellComputedStyle.width) || boardSize;
                    const cellHeight = parsePx(cellComputedStyle.height) || cellWidth;

                    // 갭과 패딩 (CSS와 정확히 일치하도록 고정)
                    const columnGap = parsePx(computedStyle.columnGap) || 5;
                    const rowGap = parsePx(computedStyle.rowGap) || columnGap;
                    const paddingTop = parsePx(computedStyle.paddingTop) || 16;
                    const paddingLeft = parsePx(computedStyle.paddingLeft) || 16;

                    // 유효성 검증
                    if (cellWidth <= 0 || cellHeight <= 0 || columnGap < 0 || rowGap < 0) {
                        console.error('[Board Dimensions] Invalid dimensions:', {
                            cellWidth,
                            cellHeight,
                            columnGap,
                            rowGap,
                        });
                        animationFrameId = requestAnimationFrame(measureBoard);
                        return;
                    }

                    boardDimensions.current = { cellWidth, cellHeight, columnGap, rowGap, paddingTop, paddingLeft };
                    setIsBoardReady(true);
                    console.log('[Board Dimensions] Calculated:', boardDimensions.current);

                    // 디버깅: 첫 몇 개 셀의 좌표 계산 확인
                    for (let i = 1; i <= 11; i++) {
                        const pos = getCellPosition(i);
                        console.log(`[Debug] Cell ${i} position: (${pos.x}, ${pos.y})`);
                    }
                } else {
                    console.warn('[Board Dimensions] Board or Cell not found. Retrying...');
                    animationFrameId = requestAnimationFrame(measureBoard);
                }
            };

            animationFrameId = requestAnimationFrame(measureBoard);
            return () => cancelAnimationFrame(animationFrameId);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
     */

    const buildBoard = () => {
        const cells = [];
        // const getTokenOffset = (index: number, total: number): string => {
        //     // 4개일 때 작은 사각형 배치
        //     if (total === 4) {
        //         switch (index) {
        //             case 0: return `translate(calc(-50% - ${offset}px), calc(-50% - ${offset}px))`; // 좌상
        //             case 1: return `translate(calc(-50% + ${offset}px), calc(-50% - ${offset}px))`; // 우상
        //             case 2: return `translate(calc(-50% - ${offset}px), calc(-50% + ${offset}px))`; // 좌하
        //             case 3: return `translate(calc(-50% + ${offset}px), calc(-50% + ${offset}px))`; // 우하
        //         }
        //     }
        //     // 1~3개일 때는 중앙 또는 약간 겹치게 (필요시 추가 구현)
        //     // 예: 1개면 중앙, 2개면 좌우, 3개면 삼각형 등
        //     return 'translate(-50%, -50%)'; // 기본값: 중앙
        // };
        for (let i = 1; i <= 100; i++) {
            // 해당 셀에 위치한 모든 플레이어를 찾음
            const playersInCell = Object.values(players).filter(p => p.position === i);
            cells.push(
                <div key={i} className={styles.cell} id={`cell-${i}`}>
                    <span className={styles.idx}>{i}</span>
                    {/* 플레이어 토큰들을 담을 컨테이너 */}
                    <div className={styles.playerContainer}>
                        {playersInCell.map((player, index) => (
                            <div key={player.id} className={styles.tokenWrapper} style={{ zIndex: index + 1 }}>
                                <Image
                                    className={styles.token} // 스타일 적용 확인
                                    data-player-id={player.id} // 플레이어 식별용 데이터 속성
                                    width={30} // 크기 약간 줄임 (겹칠 경우 대비)
                                    height={30}
                                    src={`/assets/images/${player.char}`}
                                    alt={`Player ${player.id} Token`}
                                    priority // LCP 개선을 위해 중요한 이미지는 priority 추가 고려
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return cells;
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
            faces.push(<div key={f} className={`${styles.face} ${styles[`face-${f}`]}`}>{pips}</div>);
        }
        return faces;
    };


    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    const animateDice = (result: number, duration: number, spins: number) => {
        // ... (기존 주사위 애니메이션 로직과 동일)
        const rotMap = { 1: [0, 0], 2: [0, -90], 3: [0, 180], 4: [0, 90], 5: [-90, 0], 6: [90, 0] };
        const [targetX, targetY] = rotMap[result as keyof typeof rotMap];
        const startTime = performance.now();
        const diceEl = document.getElementById('dice');
        if (!diceEl) return;

        const animate = (currentTime: number) => {
            const elapsed = (currentTime - startTime) / 1000;
            const progress = Math.min(elapsed / (duration / 1000), 1);
            const eased = easeOutQuad(progress);
            const rotX = targetX + spins * (1 - eased); // 종료 시 정확한 각도로
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
            }
        };
        requestAnimationFrame(animate);
    };

    // 주사위 굴리기 함수 (플레이어 ID를 받음)
    const rollDice = async (playerId: number) => {
        if (isRolling !== null) return; // 다른 플레이어가 굴리는 중이면 반환
        setIsRolling(playerId); // 현재 굴리는 플레이어 ID 설정
        setDiceResult(null); // 이전 결과 초기화

        console.log(`[RollDice] 플레이어 ${playerId} 주사위 굴리기 시작`);

        try {
            const res = await fetch(`/api/firebase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // API 요청 시 playerId 포함
                body: JSON.stringify({ action: 'rollDice', playerId: playerId })
            });
            if (!res.ok) throw new Error(`HTTP 에러! Status: ${res.status}`);
            const data = await res.json();
            console.log(`[RollDice] API 응답 수신 (플레이어 ${playerId}):`, data);


            if (data.diceResult) {
                animateDice(data.diceResult, 1500, 720); // 주사위 애니메이션
                setTimeout(() => {
                    setDiceResult(data.diceResult); // 애니메이션 후 결과 표시
                }, 1500);
                // 애니메이션과 토큰 이동 사이에 약간의 딜레이 추가
                setTimeout(() => {
                    moveToken(playerId, data.diceResult); // 플레이어 ID와 주사위 결과 전달
                }, 1700); // 주사위 애니메이션 끝난 직후 (1.5초) + 0.2초 딜레이
            } else {
                console.error(`[RollDice] 주사위 결과 없음 (플레이어 ${playerId})`);
                setIsRolling(null); // 오류 시 롤링 상태 해제
            }
        } catch (err) {
            console.error(`[RollDice] 오류 (플레이어 ${playerId}):`, err);
            setIsRolling(null); // 오류 발생 시 롤링 상태 해제
        }
    };

    const getCellPosition = (index: number): { x: number; y: number } => {
        if (index < 1 || index > 100) {
            console.error(`[getCellPosition] Invalid index: ${index}`);
            return { x: 0, y: 0 };
        }
        if (!isBoardReady) {
            console.warn(`[getCellPosition] Board not ready for index: ${index}`);
            return { x: 0, y: 0 };
        }

        const { cellWidth, cellHeight, columnGap, rowGap, paddingTop, paddingLeft } = boardDimensions.current;

        // 0-based 인덱스 계산
        const colIndex = (index - 1) % 10;
        const rowIndex = Math.floor((index - 1) / 10);

        // X, Y 좌표 계산
        const finalX = paddingLeft + colIndex * (cellWidth + columnGap);
        const finalY = paddingTop + rowIndex * (cellHeight + rowGap);

        return { x: finalX, y: finalY };
    };

    const moveToken = async (playerId: number, steps: number) => {
        const updatedPlayer = { ...players[playerId] };
        updatedPlayer.position = Math.min(updatedPlayer.position + steps, 100); // 100칸 제한

        const tokenEl = document.querySelector(`[data-player-id='${playerId}']`) as HTMLElement;
        const cellEl = document.getElementById(`cell-${updatedPlayer.position}`);

        if (tokenEl && cellEl) {
            const cellRect = cellEl.getBoundingClientRect();
            const boardRect = document.getElementById('board')!.getBoundingClientRect();

            const x = cellRect.left - boardRect.left + cellRect.width / 2 - 15; // token width 절반 조정
            const y = cellRect.top - boardRect.top + cellRect.height / 2 - 15;

            tokenEl.style.transform = `translate(${x}px, ${y}px)`;
            tokenEl.style.position = 'absolute';
        }

        setPlayers(prev => ({
            ...prev,
            [playerId]: updatedPlayer
        }));
        setIsRolling(null); // 롤링 해제
    };

    const handleResetGame = async () => {
        if (isResetting || isRolling !== null) return; // 리셋 중이거나 주사위 굴리는 중이면 중복 실행 방지
        setIsResetting(true); // 리셋 시작 상태
        try {
            const res = await fetch('/api/firebase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'resetGame' }) // 리셋 액션 요청
            });
            if (!res.ok) throw new Error(`HTTP 에러! Status: ${res.status}`);

            const data = await res.json();

            if (data.players) {
                setPlayers(formatPlayerData(data.players));
                setDiceResult(null); // 주사위 결과 초기화
                setIsRolling(null); // 롤링 상태 초기화
            } else {
                console.error('[ResetButton] 리셋 응답에 players 데이터 없음');
            }
        } catch (err) {
            console.error('[ResetButton] 게임 리셋 오류:', err);
        } finally {
            setIsResetting(false); // 리셋 완료 (성공/실패 무관)
            console.log('[ResetButton] 게임 리셋 완료.');
        }
    };

    // 데이터 포맷 함수 (Firebase 응답을 Players 타입으로 변환)
    const formatPlayerData = (firebaseData: any): Players => {
        const formattedPlayers: Players = {};
        if (!firebaseData) return formattedPlayers;
        for (const key in firebaseData) {
            const id = parseInt(key, 10);
            if (!isNaN(id) && playerChars.some(p => p.id === id)) {
                formattedPlayers[id] = { ...firebaseData[key], id: id };
            }
        }
        return formattedPlayers;
    }


    return (
        <div className={`${styles.game} min-h-screen w-full`}>
            {/* 주사위 */}
            <div className='h-24 flex justify-center my-12 w-full'>
                <div id="dice" className={styles.dice}>
                    {buildDice()}
                </div>
            </div>

            <div className='flex flex-col items-center justify-center gap-4'>
                {/* 보드판 */}
                <div id="board" className={`${styles.board} relative w-full !bg-yellow-400 !justify-center`}> {/* relative 추가 */}
                    {buildBoard()}
                </div>


                {/* 플레이어 버튼 */}
                <div className='flex justify-center w-full gap-2 items-center mt-4'>
                    {playerChars.map(player => (
                        <button
                            key={player.id}
                            className={`${styles.button} ${isRolling === player.id ? styles.rolling : ''} ${isRolling !== null && isRolling !== player.id ? styles.disabled : ''}`}
                            // isRolling 상태를 확인하여 해당 플레이어 턴이거나 아무도 안 굴릴 때만 활성화
                            onClick={() => rollDice(player.id)}
                            disabled={isRolling !== null} // 누군가 굴리는 중이면 모든 버튼 비활성화
                        >
                            {player.name.split('.')[0]} {/* 이름 표시 (예: 믿어핑) */}
                        </button>
                    ))}

                    {/* 게임 다시 시작 버튼 */}
                    <button
                        className={`${styles.button} ${styles.resetButton}`} // 추가 스타일링 위해 클래스 부여 가능
                        onClick={handleResetGame}
                        disabled={isResetting || isRolling !== null} // 리셋 중이거나 롤링 중이면 비활성화
                    >
                        {isResetting ? '초기화 중...' : '게임 다시 시작'}
                    </button>
                </div>

                {diceResult && <div className={styles.diceResultDisplay}>주사위: {diceResult}</div>}
            </div>
        </div>
    );
}
