
export function getRandomNumbers(count: number, max: number): number[] {
    if (count > max) throw new Error('Count cannot exceed max');
    if (count < 0 || max <= 0) throw new Error('Count and max must be positive');
    const numbers = Array.from({ length: max }, (_, i) => i + 1);
    for (let i = 0; i < count; i++) {
        const j = Math.floor(Math.random() * (max - i)) + i;
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, count);
}

export function getColoredRandomNumbers(max: number): { sky: number[], red: number[] } {
    if (max < 10) throw new Error('Max must be at least 10');
    const numbers = getRandomNumbers(10, max);
    const shuffled = [...numbers];
    for (let i = 0; i < 3; i++) {
        const j = Math.floor(Math.random() * (10 - i)) + i;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return { sky: shuffled.slice(0, 3), red: shuffled.slice(3) };
}
