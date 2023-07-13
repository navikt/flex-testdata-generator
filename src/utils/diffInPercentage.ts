export const diffInPercentage = (a: number, b: number) => {
    return Math.abs((a - b) / ((a + b) / 2)) * 100
}
