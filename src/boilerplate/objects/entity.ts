import Scene from "../scenes/scene";

abstract class Entity extends Phaser.GameObjects.GameObject {
    protected scene: Scene;

    constructor(params) {
        super(params.scene, params.type);

        this.create(params);
    }

    static preload(scene: Phaser.Scene): void {}

    create(params): void {}
}

export default Entity;
