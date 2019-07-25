import { preload } from '../../../scenes/preload';
import { IScene } from '../../../scenes/scene-interface';
import { lengthDirX, lengthDirY } from '../../../services/math/vector';
import { Depth } from '../../../services/depth';

preload((scene: IScene) => {
    scene.load.atlas('flares', './assets/particles/flares.png', './assets/particles/flares.json');
});

export class Thruster {
    public emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(
        private scene: IScene,
        private xOffset: number,
        private yOffset: number,
    ) {
        // @todo need to remove particles on destroy
        const particles = scene.add.particles('flares');
        particles.depth = Depth.THRUST;
        this.emitter = particles.createEmitter({
            frame: 'red',
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

    public start(x: number, y: number, direction: number) {
        this.emitter.setPosition(x + lengthDirX(this.xOffset, direction + 180), y + lengthDirY(this.yOffset, direction + 180));
        this.emitter.setAngle(direction + 180);
        this.emitter.start();
    }

    public stop() {
        this.emitter.stop();
    }
}
