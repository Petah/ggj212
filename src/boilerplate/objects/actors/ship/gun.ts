import { IScene } from '../../../scenes/scene-interface';
import { Bullet } from '../bullet';
import { lengthDirX, lengthDirY, pointDirection, pointDistance } from '../../../services/math/vector';
import { logSample } from '../../../services/log';

export class Gun {
    private distanceOffset: number;
    private directionOffset: number;
    private reloadTime: number = 0.3;
    private reloadingTimeLeft: number = 0;
    constructor(
        private scene: IScene,
        private xOffset: number,
        private yOffset: number,
    ) {
        // @todo need to remove events on destroy
        scene.step.update.add(this.update.bind(this));
        this.directionOffset = pointDirection(0, 0, xOffset, yOffset);
        this.distanceOffset = pointDistance(0, 0, xOffset, yOffset);
    }

    private update(time: number, delta: number) {
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
