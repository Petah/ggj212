import { EventGroup } from './event-group';
import { Debug } from '../objects/debug-draw';

export interface IScene extends Phaser.Scene {
    step: {
        input: EventGroup<() => void>,
        update: EventGroup<(time: number, delta: number) => void>,
        debug: EventGroup<(debug: Debug) => void>,
        collision: EventGroup<(time: number, delta: number) => void>,
    };
}
