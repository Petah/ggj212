export function randomBetween(
    min: number,
    max: number,
): number {
    const diff = max - min;
    return min + Math.random() * diff;
}
