import { MainScene } from "../../scenes/main-scene";
import { IDebuggable, Debug } from "../debug-draw";

declare type Polygon = {
    x: number;
    y: number;
};

export class CollisionMap implements IDebuggable {

    private polygons: SAT.Polygon[] = [];

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
                let position = new SAT.Vector(object.x, object.y);
                let points = [];

                if (object.rectangle) {
                    points = [
                        new SAT.Vector(object.x, object.y),
                        new SAT.Vector(object.x + object.width, object.y),
                        new SAT.Vector(object.x + object.width, object.y + object.height),
                        new SAT.Vector(object.x, object.y + object.height),
                    ];
                } else if (object.polygon) {
                    points = object.polygon.map((point: Polygon) => {
                        return new SAT.Vector(
                            point.x + object.x,
                            point.y + object.y
                        );
                    });
                }

                const polygon = new SAT.Polygon(position, points);
                this.polygons.push(polygon);
            }
        }
    }

    public debug(debug: Debug) {
        for (const polygon of this.polygons) {
            debug.drawPolygon(polygon.points);
        }
    }
}
