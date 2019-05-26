import Entity from "./entity";
import { MainScene } from "./mainScene";
import GM from "./gm";

export default class Light implements Entity {
    sprite: Phaser.GameObjects.Sprite;
    constructor(private scene: MainScene) {
        this.sprite = this.scene.add.sprite(100, 100, 'light');
    }
    update(): void {
        const x = this.scene.input.activePointer.worldX;
        const y = this.scene.input.activePointer.worldY;
        this.sprite.setPosition(x, y);
        this.updateTiles(Math.floor(x / 16), Math.floor(y / 16));
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

    private updateTiles(mouseX, mouseY) {
        for (let x = 0; x < this.scene.backgroundLayer.layer.width; x++) {
            for (let y = 0; y < this.scene.backgroundLayer.layer.height; y++) {
                if (GM.pointDistance(x, y, mouseX, mouseY) < 10 && !this.isBlocked(x, y, mouseX, mouseY)) {
                    this.scene.backgroundLayer.layer.data[y][x].alpha = 1;
                } else {
                    this.scene.backgroundLayer.layer.data[y][x].alpha = 0.6;
                }
            }
        }
    }

    private isBlocked(x1, y1, x2, y2): boolean {
        const direction = GM.pointDirection(x1, y1, x2, y2);
        let cx = x1;
        let cy = y1;
        let distance = null;
        do {
            const tile = this.scene.backgroundLayer.layer.data[Math.floor(cy)][Math.floor(cx)].index;
            if (tile != 81) {
                return true;
            }
            distance = GM.pointDistance(cx, cy, x2, y2);
            cx += GM.lengthDirX(1, direction);
            cy += GM.lengthDirY(1, direction);
        } while (distance > 1);
        return false;
    }

}
