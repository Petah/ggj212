export class EventGroup<T extends (...args: any) => void> {
    private callables: T[] = [];

    public constructor() {
    }

    public call(...args: any) {
        for (const callable of this.callables) {
            callable(...args);
        }
    }

    public add(callable: T) {
        this.callables.push(callable);
    }
}
