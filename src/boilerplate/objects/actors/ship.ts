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
import { Entity } from './entity';
import { Collidable } from './collidable';
import { Debug } from '../debug-draw';

preload((scene: IScene) => {
    scene.load.image('ship-red', './assets/ship/triangle.png');
    scene.load.image('box', './assets/ship/box.png');
});

export class Ship extends Collidable {
    private baseSprite: Phaser.GameObjects.Sprite;
    private health: number = 100;
    public collisionRadius = 30;

    public turnSpeed: TurnSpeed = new TurnSpeed({
        maxTurnSpeed: 2,
        acceleration: 8,
        friction: 8,
    });
    public moveSpeed: MoveSpeed = new MoveSpeed({
        max: 5,
        acceleration: 20,
        friction: 8,
        breakingFriction: 25,
    });

    public readonly input: Input = new Input();
    private thruster: Thruster;
    // private noseGun: Gun;
    private wingGuns: StaggerGun;

    public constructor(
        scene: IScene,
        x: number,
        y: number,
    ) {
        super(scene, x, y);
        this.baseSprite = this.addSprite(this.x, this.y, 'ship-red', Depth.SHIPS);
        // this.baseSprite = this.addSprite(this.x, this.y, 'box');
        this.scene.cameras.main.startFollow(this.baseSprite, true, 0.5, 0.5);
        this.thruster = new Thruster(scene, 10, 0, Dots);
        // this.noseGun = new Gun(scene, this, 30, 0);
        this.wingGuns = new StaggerGun(scene, this, [
            { x: -15, y: 30 },
            { x: -15, y: -30 },
        ]);
    }

    public onUpdate(time: number, delta: number) {
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
        this.direction = this.turnSpeed.direction;
        this.speed = this.moveSpeed.speed;

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

    public onDraw() {
        this.baseSprite.x = this.x;
        this.baseSprite.y = this.y;
        this.baseSprite.angle = this.direction;
    }

    public onDebug(debug: Debug) {
        super.onDebug(debug);
        for (const command of this.input.commands) {
            command.onDebug(debug);
        }
    }

    public onCollide(entity: Collidable): boolean {
        return false;
    }
}
