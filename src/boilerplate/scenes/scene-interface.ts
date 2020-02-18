import { EventGroup } from './event-group';
import { Debug } from '../objects/debug-draw';
import { Entity } from '../objects/actors/entity';

export interface IScene extends Phaser.Scene {
    step: {
        input: EventGroup<() => void>,
        update: EventGroup<(time: number, delta: number) => void>,
        debug: EventGroup<(debug: Debug) => void>,
        collision: EventGroup<(time: number, delta: number) => void>,
    };

    addEntity(entity: Entity): number;
    destroyEntity(entity: Entity): void;
}
