import { MainScene } from '../../scenes/main-scene';
import { IDebuggable, Debug } from '../debug-draw';
import { ICollidable } from '../../interfaces/collidable.interface';

declare interface IPolygon {
    x: number;
    y: number;
}

export class CollisionMap implements IDebuggable {
    private collidables: ICollidable[] = [];
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
                const position = new SAT.Vector(object.x, object.y);
                let points = [];

                if (object.rectangle) {
                    points = [
                        new SAT.Vector(object.x, object.y),
                        new SAT.Vector(object.x + object.width, object.y),
                        new SAT.Vector(object.x + object.width, object.y + object.height),
                        new SAT.Vector(object.x, object.y + object.height),
                    ];
                } else if (object.polygon) {
                    points = object.polygon.map((point: IPolygon) => {
                        return new SAT.Vector(
                            point.x + object.x,
                            point.y + object.y,
                        );
                    });
                }

                const polygon = new SAT.Polygon(position, points);
                this.polygons.push(polygon);
            }
        }
    }

    public handleCollisions() {
        // @Todo
    }

    public addCollidable(entity: ICollidable) {
        this.collidables.push(entity);
    }

    public getCollidablePolygons(entity: ICollidable) {
        const entityPosition = entity.getPosition();
        const entityPolygonSet = entity.getCollisionPolygons();

        const position = new SAT.Vector(entityPosition.x, entityPosition.y);
        const polygons: SAT.Polygon[] = [];

        for (const polygonSet of entityPolygonSet) {
            const points = [];
            for (const polygon of polygonSet) {
                points.push(new SAT.Vector(
                    polygon.x,
                    polygon.y,
                ));
            }

            const polygon = new SAT.Polygon(position, points);
            polygons.push(polygon);
        }

        return polygons;
    }

    public debug(debug: Debug) {
        for (const collidable of this.collidables) {
            const polygons = this.getCollidablePolygons(collidable);
            for (const polygon of polygons) {
                for (const tileMapPolygon of this.polygons) {
                    const response = new SAT.Response();
                    const collision = SAT.testPolygonPolygon(
                        polygon,
                        tileMapPolygon,
                        response,
                    );

                    if (collision) {
                        debug.drawPolygon(tileMapPolygon.points);
                        debug.drawPolygon(polygon.points);
                    }

                    this.scene.uiDebug.updateCollision(collision);
                }
            }
        }

        // for (const polygon of this.polygons) {
        //     debug.drawPolygon(polygon.points);
        // }
    }
}
