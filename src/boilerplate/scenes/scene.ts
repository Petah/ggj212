import Entity from "../objects/entity.interface";
import SceneInterface from "./scene.interface";

abstract class Scene extends Phaser.Scene implements SceneInterface {
    entities: Entity[];
    map: Phaser.Tilemaps.Tilemap;
    backgroundLayer: any;
    ui: any;
}

export default Scene;
