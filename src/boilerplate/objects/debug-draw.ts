import { MainScene } from "../scenes/main-scene";
import { logDebug } from "../services/debug";

export class Debug {
    private debugables: IDebuggable[] = [];
    private graphics: Phaser.GameObjects.Graphics;
    private text: Phaser.GameObjects.Text[] = [];
    private frame: number = 0;
    private samples: number = 0;
    private textPoolCount = 0;
    private textPool: Phaser.GameObjects.Text[] = [];
    private const updateEveryFrames = 30;

    constructor(
        private scene: MainScene,
    ) {
        this.graphics = scene.add.graphics();
    }

    public update() {
        this.frame++;
        if (this.frame % this.updateEveryFrames !== 0) {
            return;
        }
        this.clear();
        for (const debugable of this.debugables) {
            debugable.debug(this);
        }
    }

    public drawCircle(x: number, y: number, radius: number) {
        this.graphics.strokeCircle(x, y, radius);
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

    public add(debugable: IDebuggable) {
        this.debugables.push(debugable);
    }

    public sample(...args: any) {
        if (this.samples++ % 60 === 0) {
            logDebug(...args);
        }
    }

    private clear() {
        this.graphics.clear();
        this.graphics.lineStyle(3, 0xff0000, 0.8);
        this.textPoolCount = 0;
    }
}

export interface IDebuggable {
    debug(debug: Debug): void;
}
