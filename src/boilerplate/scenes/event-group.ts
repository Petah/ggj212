import { Timer } from '../services/timer';
import { IScene } from './scene-interface';

export class EventGroup<T extends (...args: any) => void> {
    private callables: T[] = [];

    public constructor(
        private scene: IScene,
        private timer: Timer,
    ) {
    }

    public call(...args: any) {
        this.timer.start();
        for (const callable of this.callables) {
            callable(...args);
        }
        this.timer.stop();
    }

    public add(callable: T) {
        this.callables.push(callable);
    }
}
