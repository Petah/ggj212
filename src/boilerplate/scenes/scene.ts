import Entity from "../objects/entity";

abstract class Scene extends Phaser.Scene {
    public entities: Entity[];
    public map: Phaser.Tilemaps.Tilemap;
    public backgroundLayer: any;
    public tileset: Phaser.Tilemaps.Tileset;
    public ui: any;
}

export default Scene;
