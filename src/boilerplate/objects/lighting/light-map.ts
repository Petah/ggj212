import { logDebug, logVerbose } from '../../services/log';
import { Debug, IDebuggable } from '../debug-draw';
import { LightStatic } from './light-static';
import { matrixDebug } from '../../services/math/matrix';
import { pointDistance, lengthDirX, lengthDirY } from '../../services/math/vector';
import { Timer } from '../../services/timer';
import { MainScene } from '../../scenes/main-scene';
import { Light } from './light';

declare type ILight = {
    x: number;
    y: number;
    range: number;
};

export interface ILightable {
    x: number;
    y: number;
    tint: number;
}

export class LightMap implements IDebuggable {

    private matrixStatic: math.Matrix;
    private matrixDynamic: math.Matrix;
    private staticLights: ILight[] = [];
    private lights: ILight[] = [];

    public constructor(
        private scene: MainScene,
        private tilemap: Phaser.Tilemaps.Tilemap,
        private blockedLayer: Phaser.Tilemaps.StaticTilemapLayer,
        private shadowLayer: Phaser.Tilemaps.DynamicTilemapLayer,
    ) {
        scene.step.update.add(this.update.bind(this));
        scene.step.debug.add(this.debug.bind(this));
        this.matrixStatic = math.zeros(1, 1) as math.Matrix;
        this.matrixDynamic = math.zeros(this.height, this.width) as math.Matrix;
        logDebug('Light map', this.height, this.width, this.tilemap.tileWidth + 'x' + this.tilemap.tileHeight);
        if (this.tilemap.tileWidth !== this.tilemap.tileHeight) {
            throw new Error('Tiles must be square');
        }
    }

    public setStaticLights(staticLights: ILight[]) {
        logDebug('Updating static lights', staticLights);
        const timer = new Timer();
        this.staticLights = staticLights;
        this.matrixStatic = this.updateLightMap(this.staticLights, 2);
        this.applyMatrixToTiles(this.matrixStatic);
        logDebug('Processed static lights', timer.stop());
        logVerbose(matrixDebug(this.matrixStatic, 2));
    }

    private updateLightMap(lights: ILight[], directionStep: number): math.Matrix {
        // @todo cull lights outside of camera view
        let matrix = math.zeros(this.height, this.width) as math.Matrix;
        for (const light of lights) {
            for (let direction = 0; direction < 360; direction += directionStep) {
                matrix = this.castRay(light.x, light.y, direction, light.range * this.tileSize, 0.45, matrix);
            }
        }
        matrix = this.blurLights(matrix);
        return matrix;
    }

    private blurLights(matrix: math.Matrix) {
        const lightMatrix = matrix.clone();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                matrix = matrix.set([y, x], Math.max(
                    lightMatrix.get([y, x]),
                    this.matrixGet(lightMatrix, x + 1, y, 0) / 2,
                    this.matrixGet(lightMatrix, x, y + 1, 0) / 2,
                    this.matrixGet(lightMatrix, x - 1, y, 0) / 2,
                    this.matrixGet(lightMatrix, x, y - 1, 0) / 2,

                    // this.matrixGet(lightMatrix, x + 2, y, 0) / 3,
                    // this.matrixGet(lightMatrix, x, y + 2, 0) / 3,
                    // this.matrixGet(lightMatrix, x - 2, y, 0) / 3,
                    // this.matrixGet(lightMatrix, x, y - 2, 0) / 3,
                    this.matrixGet(lightMatrix, x + 1, y + 1, 0) / 3,
                    this.matrixGet(lightMatrix, x + 1, y - 1, 0) / 3,
                    this.matrixGet(lightMatrix, x - 1, y + 1, 0) / 3,
                    this.matrixGet(lightMatrix, x - 1, y - 1, 0) / 3,
                ));
            }
        }
        return matrix;
    }

    private applyMatrixToTiles(matrix: math.Matrix) {
        // @todo cull tiles outside of camera view
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.shadowLayer.layer.data[y][x].alpha = 1 - matrix.get([y, x]);
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
        for (const light of this.staticLights) {
            debug.drawCircle(light.x, light.y, light.range);
        }
        for (const light of this.lights) {
            debug.drawCircle(light.x, light.y, light.range);
        }
        // for (let y = 0; y < this.height; y++) {
        //     for (let x = 0; x < this.width; x++) {
        //         debug.drawText(x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2, this.matrixStatic.get([y, x]).toFixed(2));
        //     }
        // }
    }
    //https://github.com/Silverwolf90/2d-visibility
    private castRay(x: number, y: number, direction: number, range: number, step: number, matrix: math.Matrix): math.Matrix {
        let currentX = x;
        let currentY = y;
        let distance = range;
        do {
            const currentRoundedX = Math.round(currentX / this.tileSize);
            const currentRoundedY = Math.round(currentY / this.tileSize);
            const isBlocked = this.blockedLayer.layer.data[currentRoundedY][currentRoundedX].index !== -1;
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

    public update(time: number, delta: number) {
        // let matrix = this.updateLightMap(this.lights, 90);
        // for (let y = 0; y < this.height; y++) {
        //     for (let x = 0; x < this.width; x++) {
        //         matrix.set([y, x], Math.max(matrix.get([y, x]), this.matrixStatic.get([y, x])));
        //     }
        // }
        // this.applyMatrixToTiles(matrix);
        // this.applyLightToObjects(this.matrixStatic);
    }

    public addLight(light: Light) {
        this.lights.push(light);
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
