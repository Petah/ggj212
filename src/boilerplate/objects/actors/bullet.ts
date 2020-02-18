import { lengthDirX, lengthDirY, pointDirection } from '../../services/math/vector';
import { IScene } from '../../scenes/scene-interface';
import { preload } from '../../scenes/preload';
import { Depth } from '../../services/depth';
import { Collidable } from './collidable';
import { logSample } from '../../services/log';
import { Ship } from './ship';

preload((scene: IScene) => {
    scene.load.image('laser-red-1', './assets/ship/laserRed01.png');
});

export class Bullet extends Collidable {
    public collisionRadius = 10;

    private baseSprite: Phaser.GameObjects.Sprite;
    private life = 100;
    public damage = 20;

    public constructor(
        scene: IScene,
        x: number,
        y: number,
        private ship: Ship,
        private speed: number,
        private direction: number,
    ) {
        super(scene, x, y);
        this.baseSprite = this.addSprite(this.x, this.y, 'laser-red-1', Depth.BULLETS);
    }

    public onUpdate(time: number, delta: number) {
        this.x += lengthDirX(this.speed, this.direction);
        this.y += lengthDirY(this.speed, this.direction);
        this.life--;
        if (this.life === 0) {
            this.destroy();
        }
    }

    public onDraw() {
        this.baseSprite.x = this.x;
        this.baseSprite.y = this.y;
        this.baseSprite.angle = this.direction;
    }

    public onCollide(entity: Collidable): boolean {
        return false;
    }
}
