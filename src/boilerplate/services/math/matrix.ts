export function matrixDebug(matrix: math.Matrix, decimalPlaces: number = 0): void {
    const size = matrix.size();
    const lines = [];
    for (let y = 0; y < size[0]; y++) {
        const line = [];
        for (let x = 0; x < size[1]; x++) {
            const value = matrix.get([y, x]);
            if (value === 0) {
                line.push('.'.repeat(decimalPlaces + 2));
            } else {
                line.push(value.toFixed(decimalPlaces));
            }
        }
        lines.push(line.join(' '));
    }
    return lines.join('\n');
}
