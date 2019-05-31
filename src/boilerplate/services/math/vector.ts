export default class Vector {
    public static pointDirection(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ): number {
        return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    }

    public static pointDistance(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ): number {
        return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
    }

    public static lengthDirX(length: number, direction: number): number {
        return Math.cos((direction * Math.PI) / 180) * length;
    }

    public static lengthDirY(length: number, direction: number): number {
        return Math.sin((direction * Math.PI) / 180) * length;
    }
}