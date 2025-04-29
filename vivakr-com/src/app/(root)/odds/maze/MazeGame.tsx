'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './MazeGame.module.css'; // CSS 모듈 임포트
import VivTitle from '@/components/VivTitle';

import { Cute_Font } from 'next/font/google';

const cute = Cute_Font({
    variable: '--font-cute',
    weight: '400',
    display: 'swap',
    subsets: ['latin']
})

// --- 상수 및 타입 정의 ---
const ANSWERS_LIST = [
    "무소의 뿔처럼 혼자서 가라", // Level 1
    "같은 물이라도 소가 마시면 젖이 되고 뱀이 마시면 독이된다", // Leve 2
    "사람은 먼저 자기 자신을 가르쳐야 한다 그래야만 그는 남들을 가르칠 수 있다", // Level 3
    "어떤 바보라도 컴퓨터를 사용할 수 있다 그래서 많은 사람들이 컴퓨터를 사용한다", // Level 4
    "세상에는 딱 두가지 프로그래밍 언어가 있다 사람들이 욕하는 언어와 아무도 사용하지 않는 언어", // Level 5
    "좋은 프로그래머 대부분은 돈이나 대중에게 받을 찬사를 기대하고 프로그래밍을 하지 않고 재미 있어서 한다", // Level 6
    "건강은 최상의 이익 만족은 최상의 재산 신뢰는 최상의 인연이다 그러나 마음의 평한보다 더 행복한 것은 없다", // Level 7
    "나는 드디어 상위호환성의 의미하는 바를 깨달았다 그것은 옛날에 만든 실수까지 그대로 유지해야 한다는 뜻이다 제길", // Level 8
    "손으로 십초면 충분히 할 수 있는 일을 컴퓨터로 하루 종일 프로그래밍해서 자동으로 수행할 때 나는 더할 나위 없이 큰 행복을 느낀다", // Level 9
];

// ★★★ 레벨별 시간 제한 (초 단위) - 필요에 따라 조절 ★★★
const LEVEL_TIME_LIMITS = [
    60,  // Level 1
    90,  // Level 2
    120, // Level 3
    150, // Level 4
    180, // Level 5
    210, // Level 6
    240, // Level 7
    270, // Level 8
    300, // Level 9
];

// 타입 정의 (가독성과 유지보수를 위해)
type Point = { x: number; y: number };
type CellData = { i: number; j: number; walls: boolean[]; visited: boolean };
type LetterData = { x: number; y: number; char: string; isAnswer: boolean; isLabel?: boolean; isDecoy?: boolean; };

interface MazeGameProps {
    canvasWidth?: number;
    canvasHeight?: number;
    cellSize?: number; // 고정 셀 크기 사용 옵션
}

const MazeGame: React.FC<MazeGameProps> = ({
    canvasWidth = 1000, canvasHeight = 760, cellSize = 40
}) => {
    // --- 상태 관리 ---
    const [level, setLevel] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [remainingTime, setRemainingTime] = useState<number>(LEVEL_TIME_LIMITS[0]); // ★ 남은 시간 상태
    const [score, setScore] = useState(0); // ★ 점수 상태
    // const [timerSeconds, setTimerSeconds] = useState(0);
    const [resultMsg, setResultMsg] = useState('');
    const [playerPos, setPlayerPos] = useState<Point>({ x: 0, y: 0 });
    const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set(['0,0'])); // 현재 경로 (색 변경용)
    const [collectedLetterCoords, setCollectedLetterCoords] = useState<Set<string>>(new Set()); // ★ 점수 획득한 정답 글자 좌표
    const [showPathFlag, setShowPathFlag] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);

    // --- Ref 관리 ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const gameLogicRef = useRef({
        answer: ANSWERS_LIST[0], // 초기값 설정
        COLS: Math.floor(canvasWidth / cellSize),
        ROWS: Math.floor(canvasHeight / cellSize),
        CELL: cellSize, // 셀 크기 저장
        grid: [] as CellData[],
        path: [] as { i: number; j: number }[],
        letters: [] as LetterData[],
        answerLetterCoords: new Set<string>(), // ★ 정답 글자들의 좌표 Set
        totalAnswerLetters: 0, // ★ 총 정답 글자 수
        moveStack: [{ x: 0, y: 0 }] as Point[],
        intervalId: null as NodeJS.Timeout | null,
    });
    const touchStartRef = useRef<Point>({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null); // 흔들림 효과를 위한 Ref

    // --- 유틸리티 함수 ---
    const getIndex = useCallback((i: number, j: number): number => {
        const { COLS, ROWS } = gameLogicRef.current;
        if (i < 0 || j < 0 || i >= COLS || j >= ROWS) return -1;
        return i + j * COLS;
    }, []);

    // --- 캔버스 설정 ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            ctxRef.current = canvas.getContext('2d');
            // 초기 계산 (컴포넌트 마운트 시 한번)
            gameLogicRef.current.COLS = Math.floor(canvas.width / gameLogicRef.current.CELL);
            gameLogicRef.current.ROWS = Math.floor(canvas.height / gameLogicRef.current.CELL);
            // 초기 화면 (예: 빈 캔버스 또는 안내 메시지) 그리기
            if (ctxRef.current) {
                ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
                ctxRef.current.font = `sans-serif text-[20px]`;
                ctxRef.current.textAlign = "center";
                ctxRef.current.fillText("게임을 시작하세요!", canvas.width / 2, canvas.height / 2);
            }
        }
    }, [canvasWidth, canvasHeight]); // canvas 크기가 바뀌면 다시 설정

    // --- 그리기 함수 ---
    const draw = useCallback(() => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        const logic = gameLogicRef.current;
        if (!ctx || !canvas || !logic.grid.length) return;

        const { grid, CELL, path: gamePath, letters } = logic;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. 미로 벽 그리기
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        grid.forEach(c => {
            const x = c.i * CELL; const y = c.j * CELL;
            if (c.walls[0]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + CELL, y); ctx.stroke(); }
            if (c.walls[1]) { ctx.beginPath(); ctx.moveTo(x + CELL, y); ctx.lineTo(x + CELL, y + CELL); ctx.stroke(); }
            if (c.walls[2]) { ctx.beginPath(); ctx.moveTo(x + CELL, y + CELL); ctx.lineTo(x, y + CELL); ctx.stroke(); }
            if (c.walls[3]) { ctx.beginPath(); ctx.moveTo(x, y + CELL); ctx.lineTo(x, y); ctx.stroke(); }
        });

        if (showPathFlag && gamePath.length > 0) {
            ctx.strokeStyle = "#00ffff"; ctx.lineWidth = 4; ctx.beginPath();
            ctx.moveTo(gamePath[0].i * CELL + CELL / 2, gamePath[0].j * CELL + CELL / 2);
            gamePath.forEach(p => ctx.lineTo(p.i * CELL + CELL / 2, p.j * CELL + CELL / 2));
            ctx.stroke();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const l of letters) {
            const letterKey = `${l.x},${l.y}`;
            ctx.fillStyle = l.isAnswer && visitedCells.has(letterKey) ? "red" : "black";

            // ★★★ 폰트 설정 부분 수정 ★★★
            const fontSize = l.isLabel ? CELL / 4 : CELL / 3;
            ctx.font = `${fontSize}px '빙그레 따옴체'`;
            ctx.fillText(l.char, l.x * CELL + CELL / 2, l.y * CELL + CELL / 2);
        }

        // 플레이어 그리기 (이전과 동일)
        if (isGameActive) {
            ctx.fillStyle = "blue";
            ctx.fillRect(playerPos.x * CELL + CELL / 4, playerPos.y * CELL + CELL / 4, CELL / 2, CELL / 2);
        }
    }, [showPathFlag, visitedCells, playerPos, isGameActive]);

    const removeWalls = useCallback((a: CellData, b: CellData) => {
        let dx = a.i - b.i; let dy = a.j - b.j;
        if (dx == 1) { a.walls[3] = false; b.walls[1] = false; }
        if (dx == -1) { a.walls[1] = false; b.walls[3] = false; }
        if (dy == 1) { a.walls[0] = false; b.walls[2] = false; }
        if (dy == -1) { a.walls[2] = false; b.walls[0] = false; }
    }, []);

    const openExtraPaths = useCallback((probability = 0.2) => {
        const logic = gameLogicRef.current;
        for (let c of logic.grid) {
            if (Math.random() < probability) {
                const neighbors = [];
                let top = logic.grid[getIndex(c.i, c.j - 1)]; let right = logic.grid[getIndex(c.i + 1, c.j)];
                let bottom = logic.grid[getIndex(c.i, c.j + 1)]; let left = logic.grid[getIndex(c.i - 1, c.j)];
                if (top && c.walls[0]) neighbors.push({ dir: 0, cell: top });
                if (right && c.walls[1]) neighbors.push({ dir: 1, cell: right });
                if (bottom && c.walls[2]) neighbors.push({ dir: 2, cell: bottom });
                if (left && c.walls[3]) neighbors.push({ dir: 3, cell: left });
                if (neighbors.length > 0) {
                    const { dir, cell: neighbor } = neighbors[Math.floor(Math.random() * neighbors.length)];
                    c.walls[dir] = false;
                    neighbor.walls[(dir + 2) % 4] = false;
                }
            }
        }
    }, [getIndex]);

    const generateMaze = useCallback((callback: () => void) => {
        const logic = gameLogicRef.current;
        logic.grid = [];
        for (let j = 0; j < logic.ROWS; j++) {
            for (let i = 0; i < logic.COLS; i++) {
                // Cell 생성자를 직접 호출하는 대신 객체 리터럴 사용 가능
                logic.grid.push({ i, j, walls: [true, true, true, true], visited: false });
            }
        }

        let current = logic.grid[0];
        current.visited = true;
        let stack: CellData[] = [];
        const batchSize = 150; // 속도 조절 가능

        function stepBatch() {
            let stepsInBatch = 0;
            while (stepsInBatch < batchSize) {
                let neighbors: CellData[] = [];
                let top = logic.grid[getIndex(current.i, current.j - 1)]; let right = logic.grid[getIndex(current.i + 1, current.j)];
                let bottom = logic.grid[getIndex(current.i, current.j + 1)]; let left = logic.grid[getIndex(current.i - 1, current.j)];
                [top, right, bottom, left].forEach(n => { if (n && !n.visited) neighbors.push(n); });

                if (neighbors.length > 0) {
                    stack.push(current);
                    let next = neighbors[Math.floor(Math.random() * neighbors.length)];
                    removeWalls(current, next);
                    next.visited = true;
                    current = next;
                } else if (stack.length > 0) {
                    current = stack.pop()!; // stack 보장
                } else {
                    openExtraPaths(0.2); // 확률 조절
                    callback();
                    return;
                }
                stepsInBatch++;
                if (neighbors.length === 0 && stack.length === 0) {
                    openExtraPaths(0.2);
                    callback();
                    return;
                }
            }
            // requestAnimationFrame 사용 고려 가능 (setTimeout(0) 보다 부드러울 수 있음)
            requestAnimationFrame(stepBatch);
            // setTimeout(stepBatch, 0);
        }
        requestAnimationFrame(stepBatch); // 첫 프레임에서 시작
    }, [getIndex, removeWalls, openExtraPaths]);


    const findAnswerPath = useCallback(() => {
        const logic = gameLogicRef.current;
        logic.path = [];
        let visited = new Set<string>();
        function dfs(x: number, y: number): boolean {
            if (x === logic.COLS - 1 && y === logic.ROWS - 1) {
                logic.path.push({ i: x, j: y }); return true;
            }
            const posKey = `${x},${y}`;
            visited.add(posKey);
            logic.path.push({ i: x, j: y });
            let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
            for (let i = directions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [directions[i], directions[j]] = [directions[j], directions[i]];
            }
            for (let [dx, dy] of directions) {
                let nx = x + dx, ny = y + dy;
                const nextPosKey = `${nx},${ny}`; // 공백 제거
                if (nx >= 0 && ny >= 0 && nx < logic.COLS && ny < logic.ROWS && !visited.has(nextPosKey)) {
                    let currentCell = logic.grid[getIndex(x, y)];
                    if ((dx == 1 && !currentCell.walls[1]) || (dx == -1 && !currentCell.walls[3]) ||
                        (dy == 1 && !currentCell.walls[2]) || (dy == -1 && !currentCell.walls[0])) {
                        if (dfs(nx, ny)) return true;
                    }
                }
            }
            logic.path.pop(); return false;
        }
        dfs(0, 0)
    }, [getIndex]);

    const placeLetters = useCallback(() => {
        const logic = gameLogicRef.current;
        logic.letters = [];
        const answerChars = logic.answer.split("");
        const N = answerChars.length;
        const availablePathCoords = logic.path.slice(1, -1);
        const L = availablePathCoords.length;

        if (L < N) { /* Error handling or simple placement */ return; }

        const occupiedIndices = new Set<number>();
        let lastPlacedIndex = -1;

        for (let i = 0; i < N; i++) {
            let targetIndex, offsetRange;
            const searchStartIndex = lastPlacedIndex + 1;
            if (i === N - 1) {
                const endIndex = L - 1;
                const startIndex = Math.max(searchStartIndex, L - Math.ceil(L * 0.15));
                targetIndex = startIndex + Math.floor(Math.random() * Math.max(0, (endIndex - startIndex + 1)));
                offsetRange = Math.floor(L / N * 0.3);
            } else {
                targetIndex = Math.max(searchStartIndex, Math.round(i * (L - 1) / (N - 1)));
                offsetRange = Math.floor(L / N * 0.4);
            }
            const randomOffset = Math.floor(Math.random() * (offsetRange * 2 + 1)) - offsetRange;
            let placementIndex = Math.max(searchStartIndex, Math.min(L - 1, targetIndex + randomOffset));
            let foundIndex = -1;
            for (let currentIdx = placementIndex; currentIdx < L; currentIdx++) {
                if (!occupiedIndices.has(currentIdx)) { foundIndex = currentIdx; break; }
            }
            if (foundIndex === -1) {
                for (let currentIdx = placementIndex - 1; currentIdx >= searchStartIndex; currentIdx--) {
                    if (!occupiedIndices.has(currentIdx)) { foundIndex = currentIdx; break; }
                }
            }
            if (foundIndex !== -1) {
                const p = availablePathCoords[foundIndex];
                logic.letters.push({ x: p.i, y: p.j, char: answerChars[i], isAnswer: true });
                occupiedIndices.add(foundIndex); lastPlacedIndex = foundIndex;
            } else { /* Emergency placement */
                let emergencyIndex = -1;
                for (let tempIdx = searchStartIndex; tempIdx < L; tempIdx++) {
                    if (!occupiedIndices.has(tempIdx)) { emergencyIndex = tempIdx; break; }
                }
                if (emergencyIndex !== -1) {
                    const p = availablePathCoords[emergencyIndex];
                    logic.letters.push({ x: p.i, y: p.j, char: answerChars[i], isAnswer: true });
                    occupiedIndices.add(emergencyIndex); lastPlacedIndex = emergencyIndex;
                } else { console.error("!!! 글자 비상 배치 실패 !!!"); }
            }
        }
        logic.letters.push({ x: 0, y: 0, char: "출발", isAnswer: false, isLabel: true });
        logic.letters.push({ x: logic.COLS - 1, y: logic.ROWS - 1, char: "도착", isAnswer: false, isLabel: true });
    }, []);

    const placeDecoyLetters = useCallback(() => {
        const logic = gameLogicRef.current;
        const occupiedCoords = new Set<string>();
        logic.letters.forEach(l => occupiedCoords.add(`${l.x},${l.y}`));

        const availableCells: Point[] = [];
        for (let j = 0; j < logic.ROWS; j++) {
            for (let i = 0; i < logic.COLS; i++) {
                if (!occupiedCoords.has(`${i},${j}`)) {
                    availableCells.push({ x: i, y: j });
                }
            }
        }
        // 미끼 글자 수 조절 (옵션) - 현재는 빈 칸 모두 채우기 아님
        const numDecoys = Math.max(0, availableCells.length - logic.answer.length * 2); // 음수 방지

        for (let i = availableCells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
        }
        const pathCoords = new Set(logic.path.map(p => `${p.i},${p.j}`)); // 경로 좌표 Set

        let placedCount = 0;
        for (let k = 0; k < availableCells.length && placedCount < numDecoys; k++) {
            const cell = availableCells[k];
            // 경로 상에 있는지 다시 한번 확인 (안전 장치)
            if (pathCoords.has(`${cell.x},${cell.y}`)) continue;

            const randomChar = logic.answer[Math.floor(Math.random() * logic.answer.length)];
            logic.letters.push({ x: cell.x, y: cell.y, char: randomChar, isAnswer: false, isDecoy: true });
            placedCount++;
        }
    }, []);


    // --- 게임 종료 처리 함수 ---
    const endGame = useCallback((message: string) => {
        setIsGameActive(false);
        if (gameLogicRef.current.intervalId) {
            clearInterval(gameLogicRef.current.intervalId);
            gameLogicRef.current.intervalId = null;
        }
        setResultMsg(message);
        // Optional: 약간의 딜레이 후 결과 메시지 표시 등
    }, []);

    // --- 게임 시작/정지 함수 ---
    // --- 게임 시작/정지 함수 (수정) ---
    const handleStartGame = useCallback(() => {
        if (isLoading) return;
        setIsLoading(true);
        setIsGameActive(false);
        setResultMsg('');
        setScore(0); // ★ 점수 초기화
        setCollectedLetterCoords(new Set()); // ★ 획득 좌표 초기화
        const timeLimit = LEVEL_TIME_LIMITS[level - 1] || 60; // ★ 시간 제한 설정
        setRemainingTime(timeLimit); // ★ 남은 시간 초기화
        setPlayerPos({ x: 0, y: 0 });
        setVisitedCells(new Set(['0,0']));
        setShowPathFlag(false);
        gameLogicRef.current.moveStack = [{ x: 0, y: 0 }];
        gameLogicRef.current.answer = ANSWERS_LIST[level - 1];
        if (gameLogicRef.current.intervalId) clearInterval(gameLogicRef.current.intervalId);
        gameLogicRef.current.intervalId = null;

        generateMaze(() => {
            findAnswerPath();
            placeLetters();
            placeDecoyLetters();
            setIsLoading(false);
            setIsGameActive(true);
            draw();
            // ★ 타이머 시작 (카운트다운)
            gameLogicRef.current.intervalId = setInterval(() => {
                setRemainingTime(prevTime => {
                    if (prevTime <= 1) { // 시간이 0초가 되면
                        clearInterval(gameLogicRef.current.intervalId!);
                        gameLogicRef.current.intervalId = null;
                        endGame("시간 초과! ⏳ 게임 오버!"); // 게임 종료
                        return 0;
                    }
                    return prevTime - 1; // 1초 감소
                });
            }, 1000);
        });
    }, [level, isLoading, generateMaze, findAnswerPath, placeLetters, placeDecoyLetters, draw, endGame]);

    const handleStopGame = useCallback(() => {
        endGame("게임이 중지되었습니다.");
        draw(); // 비활성 상태 반영
    }, [draw, endGame]);

    // --- 플레이어 이동 (수정: 점수, 승리/패배 체크 추가) ---
    const handleMove = useCallback((dx: number, dy: number) => {
        if (!isGameActive || isLoading) return;

        const logic = gameLogicRef.current;
        const nextX = playerPos.x + dx;
        const nextY = playerPos.y + dy;

        if (nextX < 0 || nextY < 0 || nextX >= logic.COLS || nextY >= logic.ROWS) return;
        const currentCell = logic.grid[getIndex(playerPos.x, playerPos.y)];
        if (!currentCell) return;

        let moved = false;
        if (dx === 1 && !currentCell.walls[1]) moved = true;
        if (dx === -1 && !currentCell.walls[3]) moved = true;
        if (dy === 1 && !currentCell.walls[2]) moved = true;
        if (dy === -1 && !currentCell.walls[0]) moved = true;

        if (moved) {
            const nextPos = { x: nextX, y: nextY };
            const nextPosKey = `${nextX},${nextY}`;

            // ★ 점수 획득 로직 ★
            if (logic.answerLetterCoords.has(nextPosKey) && !collectedLetterCoords.has(nextPosKey)) {
                setCollectedLetterCoords(prev => new Set(prev).add(nextPosKey));
                setScore(prev => prev + 10); // 글자당 10점 (조절 가능)
            }

            // 상태 업데이트
            setPlayerPos(nextPos);
            gameLogicRef.current.moveStack.push(nextPos);
            setVisitedCells(prev => new Set(prev).add(nextPosKey));

            // ★ 도착 지점 확인 및 승리/패배 판정 ★
            if (nextX === logic.COLS - 1 && nextY === logic.ROWS - 1) {
                // 모든 정답 글자를 모았는지 확인 (여기서 collectedLetterCoords 사용)
                if (collectedLetterCoords.size === logic.totalAnswerLetters) {
                    endGame(`클리어! 🎉 점수: ${score + 10}, 남은 시간: ${remainingTime} 초`); // 도착 점수 추가?
                } else {
                    endGame(`도착했지만 모든 글자를 모으지 못했어요! 😥`);
                }
            }
        }
    }, [isGameActive, isLoading, playerPos, getIndex, collectedLetterCoords, score, remainingTime, endGame]);

    useEffect(() => {
        // 로딩 중 아닐 때만 그리기
        if (!isLoading && (isGameActive || showPathFlag)) { // 게임 활성 또는 경로 표시 시에만 그림
            draw();
        }
    }, [playerPos, visitedCells, showPathFlag, isGameActive, draw, isLoading]); // draw 함수 자체도 의존성

    // --- 되돌리기 (수정: 점수/획득 좌표 되돌리기 필요 없음 - 단순 이동 취소) ---
    const handleUndoMove = useCallback(() => {
        if (!isGameActive || isLoading || gameLogicRef.current.moveStack.length <= 1) return;

        const currentPosKey = `${playerPos.x},${playerPos.y}`;

        // visitedCells 에서 현재 위치 제거 (색상 복원)
        setVisitedCells(prev => {
            const newSet = new Set(prev);
            newSet.delete(currentPosKey); // 현재 위치 방문 기록 삭제
            return newSet;
        });

        // ★ 주의: 획득한 점수나 collectedLetterCoords는 되돌리지 않음 (게임 규칙상)
        gameLogicRef.current.moveStack.pop();

        const prevPos = gameLogicRef.current.moveStack[gameLogicRef.current.moveStack.length - 1];
        setPlayerPos(prevPos);

    }, [isGameActive, isLoading, playerPos]);


    // --- 키보드 및 터치 이벤트 핸들러 ---
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isGameActive) return; // 게임 비활성시 무시
            switch (event.key) {
                case 'ArrowUp': handleMove(0, -1); event.preventDefault(); break;
                case 'ArrowDown': handleMove(0, 1); event.preventDefault(); break;
                case 'ArrowLeft': handleMove(-1, 0); event.preventDefault(); break;
                case 'ArrowRight': handleMove(1, 0); event.preventDefault(); break;
                case 'Backspace': handleUndoMove(); event.preventDefault(); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isGameActive, handleMove, handleUndoMove]);

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isGameActive || isLoading) return;
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, [isGameActive, isLoading]);

    const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isGameActive || isLoading) return;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const dx = endX - touchStartRef.current.x;
        const dy = endY - touchStartRef.current.y;
        const threshold = 30;

        if (Math.abs(dx) > Math.abs(dy)) { // Horizontal move
            if (dx > threshold) handleMove(1, 0);
            else if (dx < -threshold) handleMove(-1, 0);
        } else { // Vertical move
            if (dy > threshold) handleMove(0, 1);
            else if (dy < -threshold) handleMove(0, -1);
        }
    }, [isGameActive, isLoading, handleMove]);

    const handleShowPath = useCallback(() => {
        if (isLoading || !gameLogicRef.current.grid.length) return; // 로딩중 또는 게임 시작 전 불가
        setShowPathFlag(true);
    }, [isLoading]);

    const handleHidePath = useCallback(() => {
        setShowPathFlag(false);
    }, []);


    // --- 레벨 선택 핸들러 ---
    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLevel(parseInt(e.target.value));
        handleStopGame(); // 레벨 변경 시 일단 게임 중지
        if (canvasRef.current && ctxRef.current) { // 캔버스 초기화
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctxRef.current.font = "20px sans-serif";
            ctxRef.current.textAlign = "center";
            ctxRef.current.fillText("새로운 레벨 선택됨. 게임 시작 버튼을 누르세요.", canvasRef.current.width / 2, canvasRef.current.height / 2);
        }
    };

    // --- JSX 반환 ---
    return (
        <div className={styles.container} ref={containerRef}>
            <VivTitle title='정답 기반 미로 게임' />

            <div className={styles.controlsContainer}>
                <div className={styles.levelSelector}>
                    <label htmlFor="levelSelect" className={styles.levelLabel}>난이도</label>
                    <select
                        id="levelSelect"
                        value={level}
                        onChange={handleLevelChange}
                        disabled={isLoading}
                        className={styles.selectDropdown}
                    >
                        {ANSWERS_LIST.map((_, index) => (
                            <option key={index} value={index + 1}>{index + 1}단계</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleStartGame} disabled={isLoading} className={`${styles.button} ${styles.startButton}`}>
                    게임 시작
                </button>
                <button onClick={handleStopGame} disabled={!isGameActive || isLoading} className={`${styles.button} ${styles.stopButton}`}>
                    게임 중지
                </button>
                <button onClick={handleShowPath} disabled={isLoading || !isGameActive} className={`${styles.button} ${styles.pathButton}`}>
                    정답 확인
                </button>
                <button onClick={handleHidePath} disabled={isLoading || !showPathFlag} className={`${styles.button} ${styles.pathButton}`}>
                    정답 숨기기
                </button>
            </div>

            <p id="timer" className={`${styles.timerDisplay} text - center`}>
                {/* ⏱ 경과 시간: {timerSeconds}초 */}
            </p>

            {/* ★★★ 게임 정보 표시 (점수, 남은 시간) ★★★ */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1rem 0' }}>
                <p className={styles.timerDisplay}>🏆 점수: {score}</p>
                <p className={styles.timerDisplay}>⏳ 남은 시간: {remainingTime}초</p>
            </div>

            <div className={styles.canvasContainer}>
                {isLoading && (
                    <div id="loadingOverlay" className={styles.loadingOverlay}>
                        <div className={styles.loader}></div>
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                    className={styles.mazeCanvas}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                />

            </div>

            <p id="resultMsg" className={`${styles.resultMessage} text-center`}> {resultMsg}
            </p>

            <p
                className='text-xs text-slate-400 mb-4 text-center'>
                미로 생성 및 경로 탐색 로직 구현에 도움을 준 나의 친구 <b>아띠 (Atti)</b>에게 감사합니다.
            </p>
        </div>
    );
};

export default MazeGame;
