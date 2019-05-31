import Entity from '../entity';
import Vector from '../../services/math/vector';
import { MainScene } from '../../scenes/main-scene';
import Path from '../../services/path';

export default class Light extends Entity {
    private range = 20;
    private step = 0.5;
    private tileSize = 64;
    private sprite: Phaser.GameObjects.Sprite;

    public constructor(
        protected scene: MainScene,
        private map: Phaser.Tilemaps.Tilemap,
        private backgroundLayer: Phaser.Tilemaps.DynamicTilemapLayer,
    ) {
        super(scene, 'light');
        this.sprite = this.scene.add.sprite(
            this.scene.input.activePointer.worldX,
            this.scene.input.activePointer.worldY,
            'light',
        );
        console.log(this.backgroundLayer);
    }

    public create(params: any) {
        params.scene.ui.$refs.rightSidebar.addWidget({
            id: 'light',
            type: 'widget-light',
            range: this.range,
            step: this.step,
        });
    }

    public update(): void {
        const x = this.scene.input.activePointer.worldX;
        const y = this.scene.input.activePointer.worldY;
        this.sprite.setPosition(x, y);
        this.updateTiles(Math.floor(x / this.tileSize), Math.floor(y / this.tileSize));

        // this.scene.ui.$refs.rightSidebar.$refs.light[0].x = x;
        // this.scene.ui.$refs.rightSidebar.$refs.light[0].y = y;
        // this.range = this.scene.ui.$refs.rightSidebar.$refs.light[0].range;
        // this.step = this.scene.ui.$refs.rightSidebar.$refs.light[0].step;
    }

    private isValidTile(x: number, y: number): boolean {
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0 || x >= this.backgroundLayer.layer.width) {
            return false;
        }
        if (y < 0 || y >= this.backgroundLayer.layer.height) {
            return false;
        }
        return true;
    }

    private updateTiles(mouseX: number, mouseY: number) {
        for (let x = 0; x < this.backgroundLayer.layer.width; x++) {
            for (let y = 0; y < this.backgroundLayer.layer.height; y++) {
                if (!this.isValidTile(x, y)) {
                    continue;
                }
                const distance = Vector.pointDistance(mouseX, mouseY, x, y);
                if (distance < this.range && !this.isBlocked(mouseX, mouseY, x, y)) {
                    this.map.layers[0].data[y][x].alpha = Math.max(0, 1 - distance / this.range);
                } else {
                    this.map.layers[0].data[y][x].alpha = 0;
                }
            }
        }
    }

    private isBlocked(x1: number, y1: number, x2: number, y2: number): boolean {
        const direction = Vector.pointDirection(x1, y1, x2, y2);
        let cx = x1;
        let cy = y1;
        let distance = null;
        let blocked = false;
        do {
            const x = Math.round(cx);
            const y = Math.round(cy);
            if (!this.isValidTile(cx, cy)) {
                return true;
            }
            if (blocked) {
                return true;
            }
            const isFloor = this.map.layers[1].data[y][x].index === -1;
            if (!isFloor) {
                blocked = true;
            }
            distance = Vector.pointDistance(cx, cy, x2, y2);
            cx += Vector.lengthDirX(this.step, direction);
            cy += Vector.lengthDirY(this.step, direction);
        } while (distance > this.step);
        return false;
    }
}
