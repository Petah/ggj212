import { Timer } from '../services/timer';
import { IScene } from './scene-interface';
import { logSample } from '../services/log';

export class EventGroup<T extends (...args: any) => void> {
    private callables: { [id: number]: T } = {};

    public constructor(
        private scene: IScene,
        private timer: Timer,
    ) {
    }

    public call(...args: any) {
        this.timer.start();
        for (const id in this.callables) {
            this.callables[id](...args);
        }
        this.timer.stop();
    }

    public add(id: number, callable: T) {
        this.callables[id] = callable;
    }

    public remove(id: number) {
        delete this.callables[id];
    }
}
