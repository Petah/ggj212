import { lengthDirX, lengthDirY, pointDirection } from '../../services/math/vector';
import { IScene } from '../../scenes/scene-interface';
import { Input } from '../player/controller/input';
import { TurnSpeed } from './ship/turn-speed';
import { MoveSpeed } from './ship/move-speed';
import { Thruster } from './ship/thruster';
import { preload } from '../../scenes/preload';
import { Depth } from '../../services/depth';

preload((scene: IScene) => {
    scene.load.image('front', './assets/ship/playerShip2_red.png');
});

export class Ship {
    private baseSprite: Phaser.GameObjects.Sprite;
    private health: number = 100;

    public turnSpeed: TurnSpeed = new TurnSpeed({
        maxTurnSpeed: 3,
        acceleration: 0.5,
        friction: 0.1,
    });
    public moveSpeed: MoveSpeed = new MoveSpeed({
        max: 10,
        acceleration: 1,
        friction: 0.1,
        breakingFriction: 0.5,
    });
    public speed: number = 0;
    public direction: number = 0;

    public input: Input = new Input();
    private thruster: Thruster;

    public constructor(
        private scene: IScene,
        public x: number,
        public y: number,
    ) {
        // @todo need to remove events on destroy
        scene.step.update.add(this.update.bind(this));
        this.baseSprite = this.scene.add.sprite(this.x, this.y, 'front');
        this.scene.cameras.main.startFollow(this.baseSprite, true, 0.5, 0.5);
        this.baseSprite.depth = Depth.SHIPS;
        this.thruster = new Thruster(scene, 30, 30);
    }

    public update(time: number, delta: number) {
        if (this.input.turn) {
            this.turnSpeed.turn(this.input.turn);
        } else {
            this.turnSpeed.applyFriction(1);
        }
        this.turnSpeed.update();

        if (this.input.accelerate > 0) {
            this.moveSpeed.accelerate(this.input.accelerate, this.turnSpeed.direction);
            this.thruster.start(this.x, this.y, this.turnSpeed.direction);
        } else {
            this.moveSpeed.applyFriction(this.input.break);
            this.thruster.stop();
        }

        this.x += lengthDirX(this.moveSpeed.speed, this.moveSpeed.direction);
        this.y += lengthDirY(this.moveSpeed.speed, this.moveSpeed.direction);

        this.baseSprite.x = this.x;
        this.baseSprite.y = this.y;
        this.baseSprite.angle = this.turnSpeed.direction;
    }
}
