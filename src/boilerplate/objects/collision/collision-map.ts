import { MainScene } from '../../scenes/main-scene';
import { IDebuggable, Debug } from '../debug-draw';

declare interface IPolygon {
    x: number;
    y: number;
}

export interface ICollidable {
    speed: number;
    x: number;
    y: number;
    collisionPolygons: Array<Array<{ x: number, y: number }>>;
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
                let points = [];
                if (object.rectangle) {
                    points = [
                        new SAT.Vector(0, 0),
                        new SAT.Vector(object.width, 0),
                        new SAT.Vector(object.width, object.height),
                        new SAT.Vector(0, object.height),
                    ];
                } else if (object.polygon) {
                    points = object.polygon.map((point: IPolygon) => {
                        return new SAT.Vector(
                            point.x,
                            point.y,
                        );
                    });
                }
                const position = new SAT.Vector(object.x, object.y);
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

    public getCollidablePolygons(collidable: ICollidable) {
        const polygons: SAT.Polygon[] = [];

        for (const polygonSet of collidable.collisionPolygons) {
            const points = [];
            for (const polygon of polygonSet) {
                points.push(new SAT.Vector(
                    polygon.x,
                    polygon.y,
                ));
            }
            const position = new SAT.Vector(collidable.x, collidable.y);
            const polygon = new SAT.Polygon(position, points);
            polygons.push(polygon);
        }

        return polygons;
    }

    public debug(debug: Debug) {
        for (const tileMapPolygon of this.polygons) {
            debug.drawPolygon(this.satPolygonToWorldPosition(tileMapPolygon), 0x0000ff);
            for (const collidable of this.collidables) {
                const polygons = this.getCollidablePolygons(collidable);
                for (const polygon of polygons) {
                    // debug.drawPolygon(this.satPolygonToWorldPosition(polygon), 0x00ff00);
                    const response = new SAT.Response();
                    const collision = SAT.testPolygonPolygon(
                        polygon,
                        tileMapPolygon,
                        response,
                    );

                    if (collision) {
                        debug.drawPolygon(this.satPolygonToWorldPosition(tileMapPolygon));
                        debug.drawPolygon(this.satPolygonToWorldPosition(polygon));
                    }

                    this.scene.uiDebug.updateCollision(collision);
                }
            }
        }
    }

    private satPolygonToWorldPosition(satPolygon: SAT.Polygon): Array<{ x: number, y: number }> {
        return satPolygon.points.map((point) => {
            return {
                x: point.x + satPolygon.pos.x,
                y: point.y + satPolygon.pos.y,
            };
        });
    }
}
