import { MainScene } from '../scenes/main-scene';

export abstract class Entity extends Phaser.GameObjects.GameObject {
    public constructor(protected scene: MainScene, public type: string) {
        super(scene, type);
    }

    public static scenePreload(scene: MainScene): void { }
    public static sceneCreate(scene: MainScene): void { }
}
