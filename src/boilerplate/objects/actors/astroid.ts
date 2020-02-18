import { lengthDirX, lengthDirY } from '../../services/math/vector';
import { IScene } from '../../scenes/scene-interface';
import { preload } from '../../scenes/preload';
import { Depth } from '../../services/depth';
import { randomBetween } from '../../services/math/random';
import { Collidable } from './collidable';
import { logSample } from '../../services/log';
import { Bullet } from './bullet';

preload((scene: IScene) => {
    scene.load.image('astroid-big-1', './assets/ship/astroid.png');
});

export class Astroid extends Collidable {

    private baseSprite: Phaser.GameObjects.Sprite;
    private health: number = 100;
    private mass = 100;
    private velocity: { x: number, y: number };

    public collisionRadius = 40;
    public speed: number = 0;
    public direction: number = 0;
    public angle: number = 0;
    public spin: number = 0;

    public constructor(
        scene: IScene,
        x: number,
        y: number,
    ) {
        super(scene, x, y);
        this.baseSprite = this.addSprite(this.x, this.y, 'astroid-big-1', Depth.SHIPS);
        this.direction = randomBetween(0, 360);
        this.speed = randomBetween(0, 3);
        this.spin = randomBetween(-4, 4);
        this.velocity = {
            x: lengthDirX(this.speed, this.direction),
            y: lengthDirY(this.speed, this.direction),
        };
    }

    public onUpdate(time: number, delta: number) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.angle += this.spin;
    }

    public onDraw() {
        this.baseSprite.x = this.x;
        this.baseSprite.y = this.y;
        this.baseSprite.angle = this.angle;
    }

    public onCollide(entity: Collidable): boolean {
        if (entity instanceof Astroid) {
            const xDist = this.x - entity.x;
            const yDist = this.y - entity.y;
            const distSquared = xDist * xDist + yDist * yDist;
            const xVelocity = entity.velocity.x - this.velocity.x;
            const yVelocity = entity.velocity.y - this.velocity.y;
            const dotProduct = xDist * xVelocity + yDist * yVelocity;
            if (dotProduct > 0) {
                const collisionScale = dotProduct / distSquared;
                const xCollision = xDist * collisionScale;
                const yCollision = yDist * collisionScale;
                const combinedMass = this.mass + entity.mass;
                const collisionWeightA = 2 * entity.mass / combinedMass;
                const collisionWeightB = 2 * this.mass / combinedMass;
                this.velocity.x += collisionWeightA * xCollision;
                this.velocity.y += collisionWeightA * yCollision;
                entity.velocity.x -= collisionWeightB * xCollision;
                entity.velocity.y -= collisionWeightB * yCollision;
            }
            return true;
        } else if (entity instanceof Bullet) {
            this.health -= entity.damage;
            if (this.health < 0) {
                this.destroy();
            }
            entity.destroy();
            // @todo need to make sure entity doesn't cause multiple collisions
        }
        return false;
    }
}
