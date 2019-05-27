import Entity from "./entity";
import GM from "./gm";
import { MainScene } from "./main-scene";

export default class Light implements Entity {
    private sprite: Phaser.GameObjects.Sprite;
    private range = 20;
    private step = 0.5;

    constructor(private scene: MainScene) {
        this.sprite = this.scene.add.sprite(0, 0, "light");

        this.scene.ui.$refs.rightSidebar.addWidget({
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
        this.updateTiles(Math.floor(x / 16), Math.floor(y / 16));

        this.scene.ui.$refs.rightSidebar.$refs.light[0].x = x;
        this.scene.ui.$refs.rightSidebar.$refs.light[0].y = y;
        this.range = this.scene.ui.$refs.rightSidebar.$refs.light[0].range;
        this.step = this.scene.ui.$refs.rightSidebar.$refs.light[0].step;
    }

    private getTile(x, y) {
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0 || x >= this.scene.backgroundLayer.layer.width) {
            return {
                background: null,
                light: null,
            };
        }
        if (y < 0 || y >= this.scene.backgroundLayer.layer.height) {
            return {
                background: null,
                light: null,
            };
        }
        return {
            background: this.scene.map.layers[0].data[y][x],
            light: this.scene.map.layers[1].data[y][x],
        };
    }

    private updateTiles(mouseX, mouseY) {
        for (let x = 0; x < this.scene.backgroundLayer.layer.width; x++) {
            for (let y = 0; y < this.scene.backgroundLayer.layer.height; y++) {
                const { background, light } = this.getTile(x, y);
                if (background) {
                    const distance = GM.pointDistance(mouseX, mouseY, x, y);
                    if (distance < this.range && !this.isBlocked(mouseX, mouseY, x, y)) {
                        background.alpha = Math.max(0, 1 - distance / this.range);
                    } else {
                        background.alpha = 0;
                    }
                }
            }
        }
    }

    private isBlocked(x1, y1, x2, y2): boolean {
        const direction = GM.pointDirection(x1, y1, x2, y2);
        let cx = x1;
        let cy = y1;
        let distance = null;
        let blocked = false;
        do {
            const { background, light } = this.getTile(cx, cy);
            if (!background || !light) {
                return true;
            }
            if (blocked) {
                return true;
            }
            const isFloor = light.index === -1;
            if (!isFloor) {
                blocked = true;
            }
            distance = GM.pointDistance(cx, cy, x2, y2);
            cx += GM.lengthDirX(this.step, direction);
            cy += GM.lengthDirY(this.step, direction);
        } while (distance > this.step);
        return false;
    }

}
