import { logDebug } from '../services/log';
import { Depth } from '../services/depth';
import { IScene } from '../scenes/scene-interface';

export interface IDebuggable {
    debug(debug: Debug): void;
}

export class Debug {
    private graphics: Phaser.GameObjects.Graphics;
    private samples: number = 0;
    private textPoolCount = 0;
    private textPool: Phaser.GameObjects.Text[] = [];

    constructor(
        private scene: IScene,
    ) {
        scene.step.debug.add(this.update.bind(this));
        this.graphics = scene.add.graphics();
        this.graphics.depth = Depth.DEBUG;
    }

    public update() {
        this.clear();
        this.drawGrid();
    }

    public drawGrid() {
        const gridSize = 100;
        const camera = this.scene.cameras.main;
        const cameraX = Math.floor(camera.worldView.x / gridSize) * gridSize;
        const cameraY = Math.floor(camera.worldView.y / gridSize) * gridSize;
        const cameraWidth = camera.width + gridSize;
        const cameraHeight = camera.height + gridSize;
        for (let x = cameraX; x < cameraX + cameraWidth; x += gridSize) {
            this.drawLine(x, cameraY, x, cameraY + cameraHeight, 0xffffff, 0.3, 1);
        }
        for (let y = cameraY; y < cameraY + cameraHeight; y += gridSize) {
            this.drawLine(cameraX, y, cameraX + cameraWidth, y, 0xffffff, 0.3, 1);
        }
    }

    public drawCircle(x: number, y: number, radius: number, color: number = 0xff0000, alpha = 0.8, width = 3) {
        this.graphics.lineStyle(width, color, alpha);
        this.graphics.strokeCircle(x, y, radius);
    }

    public drawPolygon(points: Array<{ x: number, y: number }>, color: number = 0xff0000, alpha = 0.8, width = 3) {
        this.graphics.lineStyle(width, color, alpha);
        this.graphics.strokePoints(points, true);
    }

    public drawLine(x1: number, y1: number, x2: number, y2: number, color: number = 0xff0000, alpha = 0.8, width = 3) {
        this.graphics.lineStyle(width, color, alpha);
        this.graphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
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
