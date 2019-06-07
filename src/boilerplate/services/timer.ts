export class Timer {
    public startTime: number;
    public time: number = 0;

    constructor() {
        this.startTime = performance.now();
    }

    public start() {
        this.startTime = performance.now();
    }

    public stop() {
        this.time = performance.now() - this.startTime;
        return this.time / 1000;
    }
}
