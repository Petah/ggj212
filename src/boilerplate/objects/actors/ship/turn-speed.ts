interface ITurnSpeed {
    direction?: number;
    currentTurnSpeed?: number;
    maxTurnSpeed?: number;
    acceleration?: number;
    friction?: number;
}

export class TurnSpeed {
    public direction: number;
    public currentTurnSpeed: number;
    public maxTurnSpeed: number;
    public acceleration: number;
    public friction: number;

    constructor({
        direction = 0,
        currentTurnSpeed = 0,
        maxTurnSpeed = 0,
        acceleration = 0,
        friction = 0,
    }: ITurnSpeed) {
        this.direction = direction;
        this.currentTurnSpeed = currentTurnSpeed;
        this.maxTurnSpeed = maxTurnSpeed;
        this.acceleration = acceleration;
        this.friction = friction;
    }

    public turn(percent: number) {
        this.currentTurnSpeed += this.acceleration * percent;
        if (this.currentTurnSpeed > this.maxTurnSpeed) {
            this.currentTurnSpeed = this.maxTurnSpeed;
        } else if (this.currentTurnSpeed < -this.maxTurnSpeed) {
            this.currentTurnSpeed = -this.maxTurnSpeed;
        }
    }

    public applyFriction(percent: number) {
        if (this.currentTurnSpeed > 0) {
            this.currentTurnSpeed -= this.friction * percent;
            if (this.currentTurnSpeed < 0) {
                this.currentTurnSpeed = 0;
            }
        } else {
            this.currentTurnSpeed += this.friction * percent;
            if (this.currentTurnSpeed > 0) {
                this.currentTurnSpeed = 0;
            }
        }
    }

    public update() {
        this.direction += this.currentTurnSpeed;
        this.clamp();
    }

    private clamp() {
        while (this.direction >= 360) {
            this.direction -= 360;
        }
        while (this.direction < 0) {
            this.direction += 360;
        }
    }
}
