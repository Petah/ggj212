import { preload } from '../../../scenes/preload';
import { IScene } from '../../../scenes/scene-interface';
import { lengthDirX, lengthDirY, pointDirection, pointDistance } from '../../../services/math/vector';
import { Depth } from '../../../services/depth';
import { IThrusterConfig } from './thruster/thruster-config-interface';

preload((scene: IScene) => {
    scene.load.atlas('flares', './assets/particles/flares.png', './assets/particles/flares.json');
});

export class Thruster {
    public emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private distanceOffset: number;
    private directionOffset: number;

    constructor(
        private scene: IScene,
        private xOffset: number,
        private yOffset: number,
        private config: IThrusterConfig,
    ) {
        // @todo need to remove particles on destroy
        const particles = scene.add.particles('flares');
        particles.depth = Depth.THRUST;
        this.directionOffset = pointDirection(0, 0, xOffset, yOffset);
        this.distanceOffset = pointDistance(0, 0, xOffset, yOffset);
        this.emitter = particles.createEmitter({
            frame: config.frame,
            x: 0,
            y: 0,
            lifespan: config.lifespan,
            speed: config.speed,
            angle: config.angle,
            scale: config.scale,
            quantity: config.quantity,
            blendMode: 'ADD',
            on: false,
        });
    }

    public start(x: number, y: number, direction: number) {
        this.emitter.setPosition(
            x + lengthDirX(this.distanceOffset, direction + this.directionOffset + 180),
            y + lengthDirY(this.distanceOffset, direction + this.directionOffset + 180),
        );
        this.emitter.setAngle(direction + 180);
        this.emitter.start();
    }

    public stop() {
        this.emitter.stop();
    }
}
