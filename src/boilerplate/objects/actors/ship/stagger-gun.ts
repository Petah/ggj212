import { IScene } from '../../../scenes/scene-interface';
import { Bullet } from '../bullet';
import { lengthDirX, lengthDirY, pointDirection, pointDistance } from '../../../services/math/vector';
import { Entity } from '../entity';
import { Ship } from '../ship';

interface IMountInput {
    x: number;
    y: number;
}

interface IMount {
    distanceOffset: number;
    directionOffset: number;
}

export class StaggerGun extends Entity {
    private mounts: IMount[] = [];
    private reloadTime: number = 0.1;
    private reloadingTimeLeft: number = 0;
    private currentMount: number = 0;

    constructor(
        scene: IScene,
        private ship: Ship,
        private mountInputs: IMountInput[],
    ) {
        super(scene);
        this.mounts = mountInputs.map((mountInput) => {
            return {
                directionOffset: pointDirection(0, 0, mountInput.x, mountInput.y),
                distanceOffset: pointDistance(0, 0, mountInput.x, mountInput.y),
            };
        });
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
        const bullet = new Bullet(
            this.scene,
            x + lengthDirX(this.mounts[this.currentMount].distanceOffset, direction + this.mounts[this.currentMount].directionOffset),
            y + lengthDirY(this.mounts[this.currentMount].distanceOffset, direction + this.mounts[this.currentMount].directionOffset),
            this.ship,
            40,
            direction,
        );
        this.currentMount++;
        if (this.currentMount >= this.mounts.length) {
            this.currentMount = 0;
        }
    }
}
