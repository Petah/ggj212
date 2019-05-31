import { MainScene } from '../scenes/main-scene';

abstract class Entity extends Phaser.GameObjects.GameObject {
    public constructor(protected scene: MainScene, public type: string) {
        super(scene, type);
    }

    public static preload(scene: MainScene): void {}
}

export default Entity;
