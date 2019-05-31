import Light from '../objects/lighting/light';
import { Ui } from '../ui/ui';
import Entity from '../objects/entity';

export class MainScene extends Phaser.Scene {
    private entities: Entity[] = [];
    private ui: any;
    private map?: Phaser.Tilemaps.Tilemap;
    private backgroundLayer?: Phaser.Tilemaps.DynamicTilemapLayer;
    private tileset?: Phaser.Tilemaps.Tileset;

    public constructor() {
        super({
            key: 'MainScene',
        });
        (window as any).SCENE = this;
        this.ui = new Ui();
    }

    public preload(): void {
        this.load.image('tiles', './src/boilerplate/assets/Tileset_Large.png');
        this.load.tilemapTiledJSON(
            'Tile Layer 1',
            './src/boilerplate/tilemaps/inf.json',
        );
        this.load.image('light', './src/boilerplate/assets/player.png');
    }

    public create(): void {
        this.map = this.add.tilemap('Tile Layer 1');
        this.tileset = this.map.addTilesetImage('test', 'tiles');
        this.backgroundLayer = this.map.createDynamicLayer(
            'Tile Layer 1',
            this.tileset,
            0,
            0,
        );
        this.entities.push(new Light(this, this.map, this.backgroundLayer));
    }

    public update(): void {
        for (const entity of this.entities) {
            entity.update();
        }
    }
}
