import Entity from "./entity";
import Light from "./light";

export class MainScene extends Phaser.Scene {

    public map: Phaser.Tilemaps.Tilemap;
    public backgroundLayer: any;
    public entities: Entity[] = [];
    public tileset: Phaser.Tilemaps.Tileset;
    lightMap: Phaser.Tilemaps.Tilemap;

    constructor() {
        super({
            key: "MainScene",
        });
        (<any> window).SCENE = this;
    }

    public preload(): void {
        this.load.image("tiles", "./src/boilerplate/assets/Tileset_Large.png");
        this.load.tilemapTiledJSON("Tile Layer 1", "./src/boilerplate/tilemaps/test.json");
        this.load.image('light', './src/boilerplate/assets/player.png');
    }

    public create(): void {
        this.map = this.add.tilemap("Tile Layer 1");
        this.tileset = this.map.addTilesetImage("test", "tiles");
        this.backgroundLayer = this.map.createDynamicLayer("Tile Layer 1", this.tileset, 0, 0);
        // console.log(this.backgroundLayer.layer.data[0][0]);
        // this.input.on("pointermove", () => {
        //     console.log(arguments);
        // });
        // const map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 100, height: 100 });
        // const layer = map.createBlankDynamicLayer('Layer 1', this.tileset);
        // layer.fill(20);

        this.entities.push(new Light(this));
    }

    public update(): void {
        for (const entity of this.entities) {
            entity.update();
        }
    }
}
