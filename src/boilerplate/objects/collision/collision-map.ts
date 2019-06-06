import { MainScene } from "../../scenes/main-scene";
import { IDebuggable, Debug } from "../debug-draw";

declare type Polygon = {
    x: number;
    y: number;
};

export class CollisionMap implements IDebuggable {

    private polygons: Polygon[] = [];

    public constructor(
        private scene: MainScene,
        private tilemap: Phaser.Tilemaps.Tilemap,
    ) {
        this.loadCollisions();
        scene.debug.add(this);
    }

    private loadCollisions() {
        for (const objectLayer of this.tilemap.objects) {
            if (objectLayer.name !== 'collision') {
                continue;
            }
            for (const object of objectLayer.objects) {
                if (object.rectangle) {

                } else if (object.polygon) {
                    const polygon = object.polygon.map((point) => {
                        return {
                            x: point.x + object.x,
                            y: point.y + object.y,
                        };
                    });
                    this.polygons.push(polygon);
                }
            }
        }

    }

    public debug(debug: Debug) {
        for (const polygon of this.polygons) {
            debug.drawPolygon(polygon);
        }
    }
}
