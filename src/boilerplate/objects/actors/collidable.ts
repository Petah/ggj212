import { Entity } from './entity';
import { Debug } from '../debug-draw';

export abstract class Collidable extends Entity {
    public abstract collisionRadius: number;

    public abstract onCollide(entity: Collidable): boolean;

    public onDebug(debug: Debug) {
        debug.drawCircle(this.x, this.y, this.collisionRadius, 0xff0000, 0.9, 1);
    }
}
