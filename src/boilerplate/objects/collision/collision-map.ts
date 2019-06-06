import { MainScene } from "../../scenes/main-scene";
import { IDebuggable, Debug } from "../debug-draw";
import {Actor} from "../actors/actor";

declare type Polygon = {
    x: number;
    y: number;
};

declare type Collidable = {
    actor: Actor;
    body: SAT.Polygon;
};

export class CollisionMap implements IDebuggable {

    private collidables: Collidable[] = [];
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
                var response = new SAT.Response();
                var collision = SAT.testPolygonPolygon(
                    collidable.body,
                    polygon,
                    response
                );

                if (collision) {
                    console.log('------ COLLIDED! ------');
                    var overlapV = response.overlapV.clone().scale(-1);

                    // Update actor's sprite body
                    collidable.actor.handleCollision(overlapV);

                    // Update actor's collision body
                    collidable.body.pos.x = overlapV.x;
                    collidable.body.pos.y = overlapV.y;
                }
            }
        }
    }

    public addActor(actor: Actor) {
        const collidable = {
            actor: actor,
            body: new SAT.Polygon(
                new SAT.Vector(actor.currentSprite.sprite.x, actor.currentSprite.sprite.y),
                [
                    new SAT.Vector(
                        actor.currentSprite.sprite.x,
                        actor.currentSprite.sprite.y
                    ),
                    new SAT.Vector(
                        actor.currentSprite.sprite.x + actor.currentSprite.sprite.width,
                        actor.currentSprite.sprite.y
                    ),
                    new SAT.Vector(
                        actor.currentSprite.sprite.x + actor.currentSprite.sprite.width,
                        actor.currentSprite.sprite.y + actor.currentSprite.sprite.height
                    ),
                    new SAT.Vector(
                        actor.currentSprite.sprite.x,
                        actor.currentSprite.sprite.y + actor.currentSprite.sprite.height
                    )
                ]
            )
        };

        this.collidables.push(collidable);
    }

    public debug(debug: Debug) {
        for (const polygon of this.polygons) {
            debug.drawPolygon(polygon.points);
        }
    }
}
