import { logDebug } from '../services/log';
import { Depth } from '../services/depth';
import { IScene } from '../scenes/scene-interface';
import { Entity } from './actors/entity';

export interface IDebuggable {
    debug(debug: Debug): void;
}

export class Debug extends Entity {
    private graphics: Phaser.GameObjects.Graphics;
    private gridGraphics: Phaser.GameObjects.Graphics;
    private samples: number = 0;
    private textPoolCount = 0;
    private textPool: Phaser.GameObjects.Text[] = [];

    constructor(
        scene: IScene,
    ) {
        super(scene);
        this.graphics = scene.add.graphics();
        this.graphics.depth = Depth.DEBUG;
        this.gridGraphics = scene.add.graphics();
        this.gridGraphics.depth = Depth.DEBUG_GRID;
    }

    public onDebug() {
        this.clear();
        this.drawGrid();
    }

    public drawGrid() {
        this.gridGraphics.clear();
        const gridSize = 2000;
        const camera = this.scene.cameras.main;
        const cameraX = Math.floor(camera.worldView.x / gridSize) * gridSize;
        const cameraY = Math.floor(camera.worldView.y / gridSize) * gridSize;
        const cameraWidth = camera.displayWidth + gridSize;
        const cameraHeight = camera.worldView.height + gridSize;
        for (let x = cameraX; x < cameraX + cameraWidth; x += gridSize) {
            if (x === 0) {
                this.gridGraphics.lineStyle(2, 0xff0000, 0.9);
            } else {
                this.gridGraphics.lineStyle(1, 0xffffff, 0.4);
            }
            this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(x, cameraY, x, cameraY + cameraHeight));
        }
        for (let y = cameraY; y < cameraY + cameraHeight; y += gridSize) {
            if (y === 0) {
                this.gridGraphics.lineStyle(2, 0xff0000, 0.9);
            } else {
                this.gridGraphics.lineStyle(1, 0xffffff, 0.4);
            }
            this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(cameraX, y, cameraX + cameraWidth, y));
        }
    }

    private isInView(x: number, y: number) {
        if (x < this.scene.cameras.main.worldView.x ||
            y < this.scene.cameras.main.worldView.y ||
            x > this.scene.cameras.main.worldView.x + this.scene.cameras.main.worldView.width ||
            y > this.scene.cameras.main.worldView.y + this.scene.cameras.main.worldView.height) {
            return false;
        }
        return true;
    }

    public drawCircle(x: number, y: number, radius: number, color: number = 0xff0000, alpha = 0.8, width = 3) {
        if (!this.isInView(x, y)) {
            return;
        }
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
        if (!this.isInView(x, y)) {
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
