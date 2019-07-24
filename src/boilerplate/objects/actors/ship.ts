import { lengthDirX, lengthDirY, pointDirection } from '../../services/math/vector';
import { IScene } from '../../scenes/scene-interface';
import { motionAdd } from '../../services/math/motion';

export class Ship {
    private baseSprite: Phaser.GameObjects.Sprite;
    private health: number = 100;

    public maxSpeed = 1;
    public speed: number = 0;
    public direction: number = 0;
    public currentAcceleration: number = 0;
    public facing: number = 0;

    public constructor(
        protected scene: MainScene,
        public x: number,
        public y: number,
    ) {
        // @todo need to remove events on destroy
        scene.step.update.add(this.update.bind(this));
        this.baseSprite = this.scene.add.sprite(this.x, this.y, 'front');
        this.scene.cameras.main.startFollow(this.baseSprite, true, 0.5, 0.5);
    }

    public static scenePreload(scene: IScene): void {
        scene.load.image('front', './assets/ship/playerShip2_red.png');
    }

    public static sceneCreate(scene: IScene): void {
        // @todo
    }

    public update(time: number, delta: number) {
        motionAdd(this, this.currentAcceleration, this.facing);
        this.x += lengthDirX(this.speed, this.direction);
        this.y += lengthDirY(this.speed, this.direction);

        this.baseSprite.x = this.x;
        this.baseSprite.y = this.y;
        this.baseSprite.angle = this.direction + 90;
    }
}
