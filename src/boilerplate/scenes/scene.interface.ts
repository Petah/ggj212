import EntityInterface from "../objects/entity.interface";

export default interface SceneInterface {
    entities: EntityInterface[];
    map: Phaser.Tilemaps.Tilemap;
    backgroundLayer: any;
}
