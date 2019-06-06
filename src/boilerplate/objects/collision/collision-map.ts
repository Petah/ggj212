import { MainScene } from "../../scenes/main-scene";
import { IDebuggable, Debug } from "../debug-draw";
import {Actor} from "../actors/actor";
import {Collidable} from "../../interfaces/collidable.interface";

declare type Polygon = {
    x: number;
    y: number;
};

declare type CollidableEntity = {
    entity: Collidable,
    body: SAT.Polygon,
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
        for (const polygon of this.polygons) {
            for (const collidable of this.collidables) {
                for (const polygon of collidable.polygons) {
                    var response = new SAT.Response();
                    var collision = SAT.testPolygonPolygon(
                        collidable.body,
                        polygon,
                        response
                    );

                    if (collision) {
                        console.log('------ COLLIDED! ------');
                    }
                }
            }
        }
    }

    public addCollidable(entity: Collidable) {
        const entityPosition = entity.getPosition();
        const entityPolygonSet = entity.getCollisionPolygons();

        const position = new SAT.Vector(entityPosition.x, entityPosition.y);
        const polygons: SAT.Polygon[] = [];

        const bodyPolygons = entityPolygonSet[0].map(point => {
            return new SAT.Vector(point.x, point.y);
        });
        const body: SAT.Polygon = new SAT.Polygon(
            position,
            bodyPolygons
        );

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
            body: body,
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
