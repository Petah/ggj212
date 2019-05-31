import Light from '../objects/lighting/light';
import { Ui } from '../ui/ui';
import Entity from '../objects/entity';

export class MainScene extends Phaser.Scene {
    private entities: Entity[] = [];
    private ui: any;
    private map?: Phaser.Tilemaps.Tilemap;
    private backgroundTileset?: Phaser.Tilemaps.Tileset;
    private backgroundTilesetName = 'space-station';
    private backgroundLayer?: Phaser.Tilemaps.DynamicTilemapLayer;
    private backgroundLayerName = 'background';

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
        this.map = this.add.tilemap(this.backgroundLayerName);
        this.backgroundTileset = this.map.addTilesetImage(this.backgroundTilesetName, this.backgroundTilesetName);
        this.backgroundLayer = this.map.createDynamicLayer(
            this.backgroundLayerName,
            this.backgroundTileset,
            0,
            0,
        );
        console.log(this.map);
        this.entities.push(new Light(this, this.map, this.backgroundLayer));
    }

    public update(): void {
        for (const entity of this.entities) {
            entity.update();
        }
    }
}
