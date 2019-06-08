import { MainScene } from '../../scenes/main-scene';
import { IDebuggable, Debug } from '../debug-draw';
import { lengthDirY, lengthDirX } from '../../services/math/vector';

export interface ICollidable {
    x: number;
    y: number;
    speed: number;
    direction: number;
    collisionPolygons: Array<Array<{ x: number, y: number }>>;
}

export class CollisionMap implements IDebuggable {
    private collidables: ICollidable[] = [];
    private polygons: SAT.Polygon[] = [];
    private features = {
        bounce: 0,
        friction: 0,
    };

    public constructor(
        private scene: MainScene,
        private tilemap: Phaser.Tilemaps.Tilemap,
    ) {
        scene.step.debug.add(this.debug.bind(this));
        // scene.step.collision.add(this.handleCollisions.bind(this));
        this.loadCollisions();
    }

    public move(collidable: ICollidable) {
        collidable.x += lengthDirX(collidable.speed, collidable.direction);
        collidable.y += lengthDirY(collidable.speed, collidable.direction);

        const collisions = [];

        // @todo Use a quad tree or some broad phase of collision detection so that you don't have to test against everything
        for (const tileMapPolygon of this.polygons) {
            for (const polygon of this.getCollidablePolygons(collidable)) {
                const response = new SAT.Response();
                const collision = SAT.testPolygonPolygon(
                    polygon,
                    tileMapPolygon,
                    response,
                );

                if (collision) {
                    const overlap = response.overlapV;
                    collisions.push(overlap);
                    collidable.x -= overlap.x;
                    collidable.y -= overlap.y;
                    polygon.pos.x = collidable.x;
                    polygon.pos.y = collidable.y;

                    // Used to draw debug
                    tileMapPolygon.collision = true;
                    polygon.collision = true;
                }
            }
        }
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

    // public handleCollisions() {
    // }

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
            polygons.push(new SAT.Polygon(position, points));
        }

        return polygons;
    }

    public debug(debug: Debug) {
        for (const tileMapPolygon of this.polygons) {
            debug.drawPolygon(this.satPolygonToWorldPosition(tileMapPolygon), tileMapPolygon.collision ? 0xff0000 : 0x0000ff);
            tileMapPolygon.collision = false;
            for (const collidable of this.collidables) {
                const polygons = this.getCollidablePolygons(collidable);
                for (const polygon of polygons) {
                    debug.drawPolygon(this.satPolygonToWorldPosition(polygon), polygon.collision ? 0xff0000 : 0x00ff00);
                    polygon.collision = false;
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
