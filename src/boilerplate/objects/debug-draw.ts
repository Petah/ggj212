import { MainScene } from '../scenes/main-scene';
import { logDebug } from '../services/log';

export interface IDebuggable {
    debug(debug: Debug): void;
}

export class Debug {
    private graphics: Phaser.GameObjects.Graphics;
    private samples: number = 0;
    private textPoolCount = 0;
    private textPool: Phaser.GameObjects.Text[] = [];

    constructor(
        private scene: MainScene,
    ) {
        scene.step.debug.add(this.update.bind(this));
        this.graphics = scene.add.graphics();
    }

    public update() {
        this.clear();
    }

    public drawCircle(x: number, y: number, radius: number, color: number = 0xff0000) {
        this.graphics.lineStyle(3, color, 0.8);
        this.graphics.strokeCircle(x, y, radius);
    }

    public drawPolygon(points: Array<{ x: number, y: number }>, color: number = 0xff0000) {
        this.graphics.lineStyle(3, color, 0.8);
        this.graphics.strokePoints(points, true);
    }

    public drawText(x: number, y: number, text: string) {
        if (x < this.scene.cameras.main.scrollX ||
            y < this.scene.cameras.main.scrollY ||
            x > this.scene.cameras.main.scrollX + this.scene.cameras.main.width ||
            y > this.scene.cameras.main.scrollY + this.scene.cameras.main.height) {
            return;
        }

        this.textPoolCount++;
        if (this.textPoolCount < this.textPool.length) {
            this.textPool[this.textPoolCount].x = x;
            this.textPool[this.textPoolCount].y = y;
            this.textPool[this.textPoolCount].setText(text);
        } else {
            this.textPool.push(this.scene.add.text(x, y, text, {
                fontSize: '16px',
                fill: '#ff0000',
            }).setOrigin(0.5));
        }
    }

    public sample(...args: any) {
        if (this.samples++ % 60 === 0) {
            logDebug(...args);
        }
    }

    public clear() {
        this.graphics.clear();
        this.graphics.lineStyle(3, 0xff0000, 0.8);
        this.textPoolCount = 0;
    }
}
