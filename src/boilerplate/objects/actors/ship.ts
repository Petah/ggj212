import { lengthDirX, lengthDirY, pointDirection } from '../../services/math/vector';
import { IScene } from '../../scenes/scene-interface';
import { Input } from '../player/controller/input';
import { TurnSpeed } from './ship/turn-speed';
import { MoveSpeed } from './ship/move-speed';
import { Thruster } from './ship/thruster';
import { preload } from '../../scenes/preload';
import { Depth } from '../../services/depth';
import { Bullet } from './bullet';
import { Gun } from './ship/gun';
import { StaggerGun } from './ship/stagger-gun';
import { FatFlame } from './ship/thruster/fat-flame';
import { Dots } from './ship/thruster/dots';

preload((scene: IScene) => {
    scene.load.image('ship-red', './assets/ship/playerShip2_red.png');
    scene.load.image('box', './assets/ship/box.png');
});

export class Ship {
    private baseSprite: Phaser.GameObjects.Sprite;
    private health: number = 100;

    public turnSpeed: TurnSpeed = new TurnSpeed({
        maxTurnSpeed: 3,
        acceleration: 16,
        friction: 8,
    });
    public moveSpeed: MoveSpeed = new MoveSpeed({
        max: 10,
        acceleration: 20,
        friction: 10,
        breakingFriction: 0.5,
    });

    public readonly input: Input = new Input();
    private thruster: Thruster;
    private noseGun: Gun;
    private wingGuns: StaggerGun;

    public constructor(
        private scene: IScene,
        public x: number,
        public y: number,
    ) {
        // @todo need to remove events on destroy
        scene.step.update.add(this.update.bind(this));
        this.baseSprite = this.scene.add.sprite(this.x, this.y, 'ship-red');
        // this.baseSprite = this.scene.add.sprite(this.x, this.y, 'box');
        this.baseSprite.setOrigin(0.5, 0.5);
        this.scene.cameras.main.startFollow(this.baseSprite, true, 0.5, 0.5);
        this.baseSprite.depth = Depth.SHIPS;
        this.thruster = new Thruster(scene, 40, 0, Dots);
        this.noseGun = new Gun(scene, 30, 0);
        this.wingGuns = new StaggerGun(scene, [
            { x: -15, y: 30 },
            { x: -15, y: -30 },
        ]);
    }

    private update(time: number, delta: number) {
        if (this.input.turn) {
            this.turnSpeed.turn(delta, this.input.turn);
        } else {
            this.turnSpeed.applyFriction(delta, 1);
        }
        this.turnSpeed.update();

        if (this.input.accelerate > 0) {
            this.moveSpeed.accelerate(delta, this.input.accelerate, this.turnSpeed.direction);
        } else {
            this.moveSpeed.applyFriction(delta, this.input.break);
        }

        this.x += lengthDirX(this.moveSpeed.speed, this.moveSpeed.direction);
        this.y += lengthDirY(this.moveSpeed.speed, this.moveSpeed.direction);

        this.baseSprite.x = this.x;
        this.baseSprite.y = this.y;
        this.baseSprite.angle = this.turnSpeed.direction;

        if (this.input.accelerate > 0) {
            this.thruster.start(this.x, this.y, this.turnSpeed.direction);
        } else {
            this.thruster.stop();
        }

        if (this.input.shoot) {
            // this.noseGun.shoot(this.x, this.y, this.turnSpeed.direction);
            this.wingGuns.shoot(this.x, this.y, this.turnSpeed.direction);
        }
    }
}
