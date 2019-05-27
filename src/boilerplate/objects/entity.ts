import { default as EntityInterface } from "./entity.interface";
import Scene from "./scene";

abstract class Entity extends Phaser.GameObjects.GameObject implements EntityInterface {
    protected scene: Scene;

    constructor(params) {
        super(params.scene, params.type);

        this.create(params);
    }

    static preload(scene: Phaser.Scene): void {}

    create(params): void {}
}

export default Entity;
