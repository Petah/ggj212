import Entity from "./entity.interface";
import { default as SceneInterface } from "./scene.interface";

abstract class Scene extends Phaser.Scene implements SceneInterface {
    entities: Entity[];
    map: Phaser.Tilemaps.Tilemap;
    backgroundLayer: any;
}

export default Scene;
