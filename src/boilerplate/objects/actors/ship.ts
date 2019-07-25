import { lengthDirX, lengthDirY, pointDirection } from '../../services/math/vector';
import { IScene } from '../../scenes/scene-interface';
import { motionAdd, clamp } from '../../services/math/motion';

export class Ship {
    private baseSprite: Phaser.GameObjects.Sprite;
    private health: number = 100;

    public turnSpeed = 5;
    public accelerationSpeed = 1;
    public friction = 0.1;
    public maxSpeed = 10;
    public minSpeed = 0;
    public speed: number = 0;
    public direction: number = 0;
    public currentAcceleration: number = 0;
    public facing: number = 0;
    public emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    public constructor(
        protected scene: IScene,
        public x: number,
        public y: number,
    ) {
        // @todo need to remove events on destroy
        scene.step.update.add(this.update.bind(this));
        this.baseSprite = this.scene.add.sprite(this.x, this.y, 'front');
        this.scene.cameras.main.startFollow(this.baseSprite, true, 0.5, 0.5);
        this.baseSprite.depth = 1000;

        const particles = scene.add.particles('flares');
        particles.depth = 100;
        this.emitter = particles.createEmitter({
            frame: 'blue',
            x: 200,
            y: 300,
            lifespan: 2000,
            speed: { min: 400, max: 600 },
            angle: 330,
            scale: { start: 0.4, end: 0 },
            quantity: 2,
            blendMode: 'ADD',
            on: false,
        });
    }

    public static scenePreload(scene: IScene): void {
        scene.load.image('front', './assets/ship/playerShip2_red.png');
        scene.load.atlas('flares', './assets/particles/flares.png', './assets/particles/flares.json');
    }

    public static sceneCreate(scene: IScene): void {
    }

    public update(time: number, delta: number) {
        motionAdd(this, this.currentAcceleration, this.facing);
        this.speed = clamp(this.speed, -this.minSpeed, this.maxSpeed);
        if (!this.currentAcceleration) {
            this.emitter.stop();
            this.speed -= this.friction;
        } else {
            this.emitter.start();
        }
        this.x += lengthDirX(this.speed, this.direction);
        this.y += lengthDirY(this.speed, this.direction);
        this.emitter.setPosition(this.x + lengthDirX(20, this.facing + 180), this.y + lengthDirY(20, this.facing + 180));
        this.emitter.setAngle(this.facing + 180);

        this.baseSprite.x = this.x;
        this.baseSprite.y = this.y;
        this.baseSprite.angle = this.facing + 90;
    }
}
