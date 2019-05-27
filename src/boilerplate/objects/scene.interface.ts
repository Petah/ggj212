import Entity from "./entity.interface";

export default interface Scene {
    entities: Entity[];
    map: Phaser.Tilemaps.Tilemap;
    backgroundLayer: any;
}
