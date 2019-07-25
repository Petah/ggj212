import { lengthDirX, lengthDirY, pointDirection } from './vector';

interface IMotionEntity {
    speed: number;
    direction: number;
}

export function motionAdd(entity: IMotionEntity, speed: number, direction: number) {
    const x2 = lengthDirX(entity.speed, entity.direction) + lengthDirX(speed, direction);
    const y2 = lengthDirY(entity.speed, entity.direction) + lengthDirY(speed, direction);
    entity.speed = Math.hypot(x2, y2);
    entity.direction = pointDirection(0, 0, x2, y2);
}

export function clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
}
