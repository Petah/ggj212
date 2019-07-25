import { motionAdd } from '../../../services/math/motion';

interface ISpeed {
    min?: number;
    max?: number;
    acceleration?: number;
    friction?: number;
    breakingFriction?: number;
}

export class MoveSpeed {
    public speed: number = 0;
    public direction: number = 0;

    public min: number;
    public max: number;
    public acceleration: number;
    public friction: number;
    public breakingFriction: number;

    constructor({
        min = 0,
        max = 0,
        acceleration = 0,
        friction = 0,
        breakingFriction = 0,
    }: ISpeed) {
        this.min = min;
        this.max = max;
        this.acceleration = acceleration;
        this.friction = friction;
        this.breakingFriction = breakingFriction;
    }

    public accelerate(acceleratingPercent: number, direction: number) {
        motionAdd(this, this.acceleration * acceleratingPercent, direction);
        if (this.speed > this.max) {
            this.speed = this.max;
        }
    }

    public applyFriction(breakingPercent: number) {
        this.speed -= this.friction + ((this.breakingFriction - this.friction) * breakingPercent);
        if (this.speed < this.min) {
            this.speed = this.min;
        }
    }
}
