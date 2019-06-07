import { MainScene } from '../../scenes/main-scene';

export class Light {
    public range = 20;
    public color = null;

    public constructor(
        private scene: MainScene,
        public x: number,
        public y: number,
    ) {
        scene.lightMap.addLight(this);
    }
}
