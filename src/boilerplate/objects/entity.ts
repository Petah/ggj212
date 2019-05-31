import Scene from '../scenes/scene';

abstract class Entity extends Phaser.GameObjects.GameObject {
    protected scene: Scene;

    public constructor(params) {
        super(params.scene, params.type);

        this.create(params);
    }

    public static preload(scene: Phaser.Scene): void {}

    public create(params): void {}
}

export default Entity;
