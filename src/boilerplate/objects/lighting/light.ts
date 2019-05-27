import Drawable from "../drawable";
import Vector from "../../services/math/vector";
import Path from "../../services/path";

export default class Light extends Drawable {
    range = 20;

    preload(): void {
        this.scene.load.image('light', Path.asset('lamp.png'));
    }

    update(): void {
        const x = this.scene.input.activePointer.worldX;
        const y = this.scene.input.activePointer.worldY;
        this.sprite.setPosition(x, y);
        // if (this.scene.input.activePointer.isDown) {
        this.updateTiles(Math.floor(x / 16), Math.floor(y / 16));
        // }
        // console.log(x / 16, y / 16);
        // const tx = Math.floor(x / 16);
        // const ty = Math.floor(y / 16);
        // for (let txx = tx - 10; txx < tx + 10; txx++) {
        //     if (txx < 0 || txx >= 100) {
        //         continue;
        //     }
        //     for (let tyy = ty - 10; tyy < ty + 10; tyy++) {
        //         if (tyy < 0 || tyy >= 100) {
        //             continue;
        //         }
        //         this.scene.backgroundLayer.layer.data[tyy][txx].alpha = 0.9;
        //     }
        // }

        // console.log(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY);
    }

    private getTile(x, y) {
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0 || x >= this.scene.backgroundLayer.layer.width) {
            return null;
        }
        if (y < 0 || y >= this.scene.backgroundLayer.layer.height) {
            return null;
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
                    const distance = Vector.pointDistance(mouseX, mouseY, x, y);
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
        const direction = Vector.pointDirection(x1, y1, x2, y2);
        let cx = x1;
        let cy = y1;
        let distance = null;
        let blocked = false;
        do {
            const { background, light } = this.getTile(cx, cy);
            if (!light) {
                return true;
            }
            if (blocked) {
                return true;
            }
            const isFloor = light.index === -1;
            if (!isFloor) {
                blocked = true;
            }
            distance = Vector.pointDistance(cx, cy, x2, y2);
            cx += Vector.lengthDirX(0.5, direction);
            cy += Vector.lengthDirY(0.5, direction);
        } while (distance > 0.5);
        return false;
    }
}
