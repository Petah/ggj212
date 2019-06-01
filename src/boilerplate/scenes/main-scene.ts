import Light from '../objects/lighting/light';
import { Ui } from '../ui/ui';
import Entity from '../objects/entity';
import { Team } from '../objects/player/team';
import { LightMap } from '../objects/lighting/light-map';
import { Level } from './level';

export class MainScene extends Phaser.Scene {
    private entities: Entity[] = [];
    private ui: Ui;
    private backgroundTilesetName = 'space-station';
    private backgroundLayerName = 'background';

    private level?: Level;

    public constructor() {
        super({
            key: 'MainScene',
        });
        (window as any).SCENE = this;
        this.ui = new Ui();
    }

    public preload(): void {
        this.load.image(this.backgroundTilesetName, './assets/space-station.png');
        this.load.tilemapTiledJSON(this.backgroundLayerName, './tilemaps/space-station.json');
        this.load.image('light', './assets/lamp.png');
    }

    public create(): void {
        const map = this.add.tilemap(this.backgroundLayerName);
        const backgroundTileset = map.addTilesetImage(this.backgroundTilesetName, this.backgroundTilesetName);
        const backgroundLayer = map.createDynamicLayer(
            this.backgroundLayerName,
            backgroundTileset,
            0,
            0,
        );
        this.level = new Level(
            map,
            backgroundTileset,
            backgroundLayer,
        );
    }

    public update(): void {
        for (const entity of this.entities) {
            entity.update();
        }
    }

    private pause(): void {

    }

}
