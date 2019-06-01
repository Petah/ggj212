import { LightStatic } from "./light-static";
import { matrixDebug } from "../../services/math/matrix";
import { logDebug } from "../../services/debug";
import { pointDistance, lengthDirX, lengthDirY } from "../../services/math/vector";

export class LightMap {

    private matrixStatic: math.Matrix;
    private matrixDynamic: math.Matrix;

    public constructor(
        private tilemap: Phaser.Tilemaps.Tilemap,
    ) {
        this.matrixStatic = math.zeros(1, 1) as math.Matrix;
        this.matrixDynamic = math.zeros(this.height, this.width) as math.Matrix;
    }

    set staticLights(staticLights: LightStatic[]) {
        logDebug('Updating static lights', staticLights);
        this.matrixStatic = math.zeros(this.height, this.width) as math.Matrix;
        for (const staticLight of staticLights) {
            const x = Math.round(staticLight.x / this.tilemap.tileWidth);
            const y = Math.round(staticLight.x / this.tilemap.tileHeight);
            this.matrixStatic = this.matrixStatic.set([y, x], 1);
            for (let direction = 0; direction < 360; direction += 1) {
                this.matrixStatic = this.castRay(x, y, direction, staticLight.range, 0.3, this.matrixStatic);
            }
        }
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.tilemap.layers[0].data[y][x].alpha = this.matrixStatic.get([y, x]);
            }
        }
        logDebug(matrixDebug(this.matrixStatic, 2));
    }

    private castRay(x: number, y: number, direction: number, range: number, step: number, matrix: math.Matrix): math.Matrix {
        let currentX = x;
        let currentY = x;
        let distance = range;
        do {
            const currentRoundedX = Math.round(currentX);
            const currentRoundedY = Math.round(currentY);
            const isBlocked = this.tilemap.layers[1].data[currentRoundedY][currentRoundedX].index !== -1;
            if (isBlocked) {
                break;
            }
            const currentValue = matrix.get([currentRoundedY, currentRoundedX]);
            const newValue = 1 - distance / range;
            if (newValue > currentValue) {
                matrix = matrix.set([currentRoundedY, currentRoundedX], 1 - distance / range);
            }
            currentX += lengthDirX(step, direction);
            currentY += lengthDirY(step, direction);
            distance = pointDistance(x, y, currentX, currentY);
        } while (distance < range && currentX >= 0 && currentY >= 0 && currentX < this.width && currentY < this.height);
        return matrix;
    }

    private get width(): number {
        return this.tilemap.width;
    }

    private get height(): number {
        return this.tilemap.height;
    }
}
