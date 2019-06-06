import { logDebug } from '../../services/debug';
import { Debug, IDebuggable } from '../debug-draw';
import { LightStatic } from './light-static';
import { Matrix } from 'mathjs';
import { matrixDebug } from '../../services/math/matrix';
import { pointDistance, lengthDirX, lengthDirY } from '../../services/math/vector';
import { Timer } from '../../services/timer';
import { MainScene } from '../../scenes/main-scene';

export class LightMap implements IDebuggable {

    private matrixStatic: math.Matrix;
    private matrixDynamic: math.Matrix;
    private staticLights: LightStatic[] = [];

    public constructor(
        private scene: MainScene,
        private tilemap: Phaser.Tilemaps.Tilemap,
    ) {
        this.matrixStatic = math.zeros(1, 1) as math.Matrix;
        this.matrixDynamic = math.zeros(this.height, this.width) as math.Matrix;
        logDebug('Light map', this.height, this.width, this.tilemap.tileWidth + 'x' + this.tilemap.tileHeight);
        if (this.tilemap.tileWidth !== this.tilemap.tileHeight) {
            throw new Error('Tiles must be square');
        }
        // scene.debug.add(this.lightMap);
    }

    public setStaticLights(staticLights: LightStatic[]) {
        logDebug('Updating static lights', staticLights);
        const timer = new Timer();
        this.staticLights = staticLights;
        this.matrixStatic = math.zeros(this.height, this.width) as math.Matrix;
        for (const staticLight of staticLights) {
            logDebug('Static light', staticLight);
            for (let direction = 0; direction < 360; direction += 2) {
                this.matrixStatic = this.castRay(staticLight.x, staticLight.y, direction, staticLight.range * this.tileSize, 0.45, this.matrixStatic);
            }
        }
        this.blurStaticLights();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.tilemap.layers[0].data[y][x].alpha = this.matrixStatic.get([y, x]);
            }
        }
        logDebug('Processed static lights', timer.stop());
        logDebug(matrixDebug(this.matrixStatic, 2));
    }

    private blurStaticLights() {
        const lightMatrix = this.matrixStatic.clone();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.matrixStatic = this.matrixStatic.set([y, x], Math.max(
                    lightMatrix.get([y, x]),
                    this.matrixGet(lightMatrix, x + 1, y, 0) / 2,
                    this.matrixGet(lightMatrix, x, y + 1, 0) / 2,
                    this.matrixGet(lightMatrix, x - 1, y, 0) / 2,
                    this.matrixGet(lightMatrix, x, y - 1, 0) / 2,

                    this.matrixGet(lightMatrix, x + 2, y, 0) / 3,
                    this.matrixGet(lightMatrix, x, y + 2, 0) / 3,
                    this.matrixGet(lightMatrix, x - 2, y, 0) / 3,
                    this.matrixGet(lightMatrix, x, y - 2, 0) / 3,
                    this.matrixGet(lightMatrix, x + 1, y + 1, 0) / 3,
                    this.matrixGet(lightMatrix, x + 1, y - 1, 0) / 3,
                    this.matrixGet(lightMatrix, x - 1, y + 1, 0) / 3,
                    this.matrixGet(lightMatrix, x - 1, y - 1, 0) / 3,
                ));
            }
        }
    }

    private matrixGet(matrix: Matrix, x: number, y: number, defaultValue: number) {
        const size = matrix.size();
        if (x < 0 ||
            x >= size[1] ||
            y < 0 ||
            y >= size[0]) {
            return defaultValue;
        }
        return matrix.get([y, x]);
    }

    public debug(debug: Debug) {
        for (const staticLight of this.staticLights) {
            debug.drawCircle(staticLight.x, staticLight.y, staticLight.range);

        }
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                debug.drawText(x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2, this.matrixStatic.get([y, x]).toFixed(2));
            }
        }
    }

    private castRay(x: number, y: number, direction: number, range: number, step: number, matrix: math.Matrix): math.Matrix {
        let currentX = x;
        let currentY = y;
        let distance = range;
        do {
            const currentRoundedX = Math.round(currentX / this.tileSize);
            const currentRoundedY = Math.round(currentY / this.tileSize);
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
        } while (
            distance < range &&
            currentX >= 0 &&
            currentY >= 0 &&
            currentX < this.tilemap.widthInPixels &&
            currentY < this.tilemap.heightInPixels
        );
        return matrix;
    }

    private get width(): number {
        return this.tilemap.width;
    }

    private get height(): number {
        return this.tilemap.height;
    }

    private get tileSize(): number {
        return this.tilemap.tileWidth;
    }
}
