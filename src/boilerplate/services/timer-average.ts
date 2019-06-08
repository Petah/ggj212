import { Timer } from './timer';

export class TimerAverage extends Timer {
    private times: number[] = [];
    private sampleSize: number = 60;

    public stop() {
        const time = super.stop();
        this.times.push(time);
        if (this.times.length > this.sampleSize) {
            this.times.shift();
        }
        return time;
    }

    public get average() {
        const sum = this.times.reduce((a, b) => a + b, 0);
        return sum / this.times.length;
    }
}
