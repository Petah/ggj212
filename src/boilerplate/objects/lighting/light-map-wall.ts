import { Debug, IDebuggable } from '../debug-draw';
import { MainScene } from '../../scenes/main-scene';
import { Light } from './light';
import { ILight } from './light-map';
import { Segment } from './wall-tracking/segment';
import { Point } from './wall-tracking/point';
import { loadMap } from './wall-tracking/load-map';
import { calculateVisibility } from './wall-tracking/visibility';
import { lengthDirX, pointDirection, lengthDirY, pointDistance } from '../../services/math/vector';
import { logSample } from '../../services/log';

interface ILightWallObject {
    polyline: Point[];
}

export class LightMapWall implements IDebuggable {

    private staticLights: ILight[] = [];
    private lights: ILight[] = [];
    private walls: Segment[] = [];
    private visibility: Point[][] = [];

    public constructor(
        private scene: MainScene,
        private tilemap: Phaser.Tilemaps.Tilemap,
        private shadowLayer: Phaser.Tilemaps.DynamicTilemapLayer,
    ) {
        scene.step.update.add(this.update.bind(this));
        scene.step.debug.add(this.debug.bind(this));

        const layer = this.tilemap.objects.find(l => l.name === 'light-wall');
        if (!layer) {
            throw new Error('Could not find light map wall layer');
        }
        for (const object of layer.objects) {
            if (!object.polyline) {
                continue;
            }
            for (let i = 0; i < object.polyline.length - 1; i++) {
                this.walls.push(new Segment(
                    object.x + object.polyline[i].x,
                    object.y + object.polyline[i].y,
                    object.x + object.polyline[i + 1].x,
                    object.y + object.polyline[i + 1].y,
                ));
            }
        }
    }

    public update(time: number, delta: number) {
        for (const { x, y, tile } of this.getVisibleTiles()) {
            tile.alpha = 1;
        }

        // const lightSource = new Point(this.lights[0].x, this.lights[0].y);
        for (const light of this.lights) {
            // @todo cull lights that are way off the camera view
            const endpoints = loadMap(this.walls, light);
            this.visibility = calculateVisibility(light, endpoints);
            for (const { x, y, tile } of this.getVisibleTiles()) {
                const tileCenter = {
                    x: x * this.tilemap.tileWidth + this.tilemap.tileWidth / 2,
                    y: y * this.tilemap.tileHeight + this.tilemap.tileHeight / 2,
                }
                let visible = false;
                for (const points of this.visibility) {
                    if (this.isInTriangle(
                        tileCenter,
                        light,
                        this.extendAngle(points[0], light),
                        this.extendAngle(points[1], light),
                    )) {
                        visible = true;
                        break;
                    }
                }
                if (visible) {
                    const fadedAlpha = pointDistance(light.x, light.y, tileCenter.x, tileCenter.y) / 600;
                    tile.alpha = Math.min(fadedAlpha, tile.alpha);
                }
            }
        }
    }

    private *getVisibleTiles() {
        for (let y = 0; y < this.tilemap.height; y++) {
            if (y * this.tilemap.tileHeight < this.scene.cameras.main.scrollY - this.tilemap.tileHeight) {
                continue;
            }
            if (y * this.tilemap.tileHeight > this.scene.cameras.main.scrollY + this.scene.cameras.main.height) {
                continue;
            }
            for (let x = 0; x < this.tilemap.width; x++) {
                if (x * this.tilemap.tileWidth < this.scene.cameras.main.scrollX - this.tilemap.tileWidth) {
                    continue;
                }
                if (x * this.tilemap.tileWidth > this.scene.cameras.main.scrollX + this.scene.cameras.main.width) {
                    continue;
                }
                yield {
                    x,
                    y,
                    tile: this.shadowLayer.layer.data[y][x],
                };
            }
        }
    }

    private extendAngle(point: Point, source: Point): Point {
        const direction = pointDirection(source.x, source.y, point.x, point.y);
        return {
            x: point.x + lengthDirX(16, direction),
            y: point.y + lengthDirY(16, direction),
        }
    }

    private isInTriangle(p: Point, a: Point, b: Point, c: Point): boolean {
        const v0 = [c.x - a.x, c.y - a.y];
        const v1 = [b.x - a.x, b.y - a.y];
        const v2 = [p.x - a.x, p.y - a.y];

        const dot00 = (v0[0] * v0[0]) + (v0[1] * v0[1]);
        const dot01 = (v0[0] * v1[0]) + (v0[1] * v1[1]);
        const dot02 = (v0[0] * v2[0]) + (v0[1] * v2[1]);
        const dot11 = (v1[0] * v1[0]) + (v1[1] * v1[1]);
        const dot12 = (v1[0] * v2[0]) + (v1[1] * v2[1]);

        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return ((u >= 0) && (v >= 0) && (u + v < 1));
    }

    public debug(debug: Debug) {
        for (const segment of this.walls) {
            // debug.drawLine(segment.p1.x, segment.p1.y, segment.p2.x, segment.p2.y, 0xffff00);
        }
        for (const light of this.lights) {
            debug.drawCircle(light.x, light.y, 5, 0xffff00);
        }

        const lightSource = new Point(this.lights[0].x, this.lights[0].y);
        for (const points of this.visibility) {
            debug.drawLine(lightSource.x, lightSource.y, points[0].x, points[0].y, 0xffff00, 0.3);
            debug.drawLine(lightSource.x, lightSource.y, points[1].x, points[1].y, 0xffff00, 0.3);
            debug.drawLine(points[0].x, points[0].y, points[1].x, points[1].y, 0xffff00, 0.3);
        }
    }

    public setStaticLights(staticLights: ILight[]) {
        this.lights.push(...staticLights);
    }

    public addLight(light: Light) {
        this.lights.push(light);
    }

}
