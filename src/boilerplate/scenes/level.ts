import Light from '../objects/lighting/light';
import { Ui } from '../ui/ui';
import Entity from '../objects/entity';
import { Team } from '../objects/player/team';
import { LightMap } from '../objects/lighting/light-map';
import { LightStatic } from '../objects/lighting/light-static';
import { logDebug } from '../services/debug';

export class Level {

    public readonly width: number;
    public readonly height: number;

    private teams: Team[] = [];
    private lightMap: LightMap;

    public constructor(
        private tilemap: Phaser.Tilemaps.Tilemap,
        private backgroundTileset: Phaser.Tilemaps.Tileset,
        private backgroundLayer: Phaser.Tilemaps.DynamicTilemapLayer,
    ) {
        this.width = this.tilemap.width;
        this.height = this.tilemap.height;
        this.lightMap = new LightMap(this.tilemap);
        this.loadObjects();
        // this.lightMap = new LightMap(map);
        // this.entities.push(new Light(this, map, this.backgroundLayer));

    }

    private loadObjects() {
        const staticLights = [];
        for (const objectLayer of this.tilemap.objects) {
            for (const object of objectLayer.objects) {
                logDebug('Load tilemap object', object);
                switch (object.type) {
                    case 'light-static':
                        staticLights.push(new LightStatic(object.x, object.y));
                        break;
                }
            }
        }
        this.lightMap.staticLights = staticLights;
    }

}
