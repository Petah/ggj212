import { lengthDirX, lengthDirY } from '../../services/math/vector';
import { IScene } from '../../scenes/scene-interface';
import { preload } from '../../scenes/preload';
import { Depth } from '../../services/depth';
import { randomBetween } from '../../services/math/random';

preload((scene: IScene) => {
    scene.load.image('astroid-big-1', './assets/ship/meteorBrown_big1.png');
});

export class Astroid {
    private baseSprite: Phaser.GameObjects.Sprite;
    private health: number = 100;

    public speed: number = 0;
    public direction: number = 0;
    public spin: number = 0;

    public constructor(
        private scene: IScene,
        public x: number,
        public y: number,
    ) {
        // @todo need to remove events on destroy
        scene.step.update.add(this.update.bind(this));
        this.baseSprite = this.scene.add.sprite(this.x, this.y, 'astroid-big-1');
        this.baseSprite.setOrigin(0.5, 0.5);
        this.baseSprite.depth = Depth.SHIPS;
        this.direction = randomBetween(0, 360);
        this.speed = randomBetween(0, 3);
        this.spin = randomBetween(-5, 5);
    }

    private update(time: number, delta: number) {
        this.x += lengthDirX(this.speed, this.direction);
        this.y += lengthDirY(this.speed, this.direction);

        this.baseSprite.x = this.x;
        this.baseSprite.y = this.y;
        this.baseSprite.angle += this.spin;
    }
}
