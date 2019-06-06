import { MainScene } from "../../scenes/main-scene";
import { IDebuggable, Debug } from "../debug-draw";
import {Collidable} from "../../interfaces/collidable.interface";

declare type Polygon = {
    x: number;
    y: number;
};

declare type CollidableEntity = {
    entity: Collidable,
    polygons: SAT.Polygon[],
};

export class CollisionMap implements IDebuggable {
    private collidables: CollidableEntity[] = [];
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

    public handleCollisions() {
        for (const tileMapPolygon of this.polygons) {
            for (const collidable of this.collidables) {
                for (const collidablePolygon of collidable.polygons) {
                    const response = new SAT.Response();
                    const collision = SAT.testPolygonPolygon(
                        collidablePolygon,
                        tileMapPolygon,
                        response
                    );

                    this.scene.uiDebug.updateCollision(collision);
                }
            }
        }
    }

    public addCollidable(entity: Collidable) {
        console.log('DEBUG', this.scene.debug);
        const entityPosition = entity.getPosition();
        const entityPolygonSet = entity.getCollisionPolygons();

        const position = new SAT.Vector(entityPosition.x, entityPosition.y);
        const polygons: SAT.Polygon[] = [];

        for (const polygonSet of entityPolygonSet) {
            const points = [];
            for (const polygon of polygonSet) {
                points.push(new SAT.Vector(
                    polygon.x,
                    polygon.y
                ));
            }

            const polygon = new SAT.Polygon(position, points);
            polygons.push(polygon);
        }

        const collidable = {
            entity: entity,
            polygons: polygons,
        };

        this.collidables.push(collidable);
    }

    public debug(debug: Debug) {
        for (const polygon of this.polygons) {
            debug.drawPolygon(polygon.points);
        }
    }
}
