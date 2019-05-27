import Entity from "../objects/entity.interface";

abstract class Scene extends Phaser.Scene {
    entities: Entity[];
    map: Phaser.Tilemaps.Tilemap;
    backgroundLayer: any;
    ui: any;
}

export default Scene;
