import { IScene } from '../../../scenes/scene-interface';
import { Bullet } from '../bullet';
import { lengthDirX, lengthDirY, pointDirection, pointDistance } from '../../../services/math/vector';
import { Entity } from '../entity';

export class Gun extends Entity {
    private distanceOffset: number;
    private directionOffset: number;
    private reloadTime: number = 0.3;
    private reloadingTimeLeft: number = 0;

    constructor(
        scene: IScene,
        private xOffset: number,
        private yOffset: number,
    ) {
        super(scene);
        this.directionOffset = pointDirection(0, 0, xOffset, yOffset);
        this.distanceOffset = pointDistance(0, 0, xOffset, yOffset);
    }

    public onUpdate(time: number, delta: number) {
        if (this.reloadingTimeLeft > 0) {
            this.reloadingTimeLeft -= delta;
        }
    }

    public shoot(x: number, y: number, direction: number) {
        if (this.reloadingTimeLeft > 0) {
            return;
        }
        this.reloadingTimeLeft = this.reloadTime;
        // const bullet = new Bullet(this.scene, x + lengthDirX(this.xOffset, direction), y + lengthDirY(this.yOffset, direction), 40, direction);
        const bullet = new Bullet(
            this.scene,
            x + lengthDirX(this.distanceOffset, direction + this.directionOffset),
            y + lengthDirY(this.distanceOffset, direction + this.directionOffset),
            40,
            direction,
        );
        // const bullet = new Bullet(this.scene, x, y, 40, direction);
    }
}
