import { lengthDirX, lengthDirY, pointDirection } from '../../services/math/vector';
import { IScene } from '../../scenes/scene-interface';
import { Input } from '../player/controller/input';
import { TurnSpeed } from './ship/turn-speed';
import { MoveSpeed } from './ship/move-speed';
import { Thruster } from './ship/thruster';
import { preload } from '../../scenes/preload';
import { Depth } from '../../services/depth';

preload((scene: IScene) => {
    scene.load.image('laser-red-1', './assets/ship/laserRed01.png');
});

export class Bullet {
    private baseSprite: Phaser.GameObjects.Sprite;
    public constructor(
        private scene: IScene,
        private x: number,
        private y: number,
        private speed: number,
        private direction: number,
    ) {
        // @todo need to remove events on destroy
        scene.step.update.add(this.update.bind(this));
        this.baseSprite = this.scene.add.sprite(this.x, this.y, 'laser-red-1');
        this.baseSprite.depth = Depth.BULLETS;
    }

    private update(time: number, delta: number) {

        this.x += lengthDirX(this.speed, this.direction);
        this.y += lengthDirY(this.speed, this.direction);

        this.baseSprite.x = this.x;
        this.baseSprite.y = this.y;
        this.baseSprite.angle = this.direction;
    }
}
