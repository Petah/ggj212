export class MainScene extends Phaser.Scene {
    private phaserSprite: Phaser.GameObjects.Sprite;

    map: Phaser.Tilemaps.Tilemap;
    backgroundLayer: any;

    constructor() {
        super({
            key: "MainScene",
        });
    }

    public preload(): void {
        this.load.image("tiles", "./src/boilerplate/assets/Tileset_Large.png");
        this.load.tilemapTiledJSON("Tile Layer 1", "./src/boilerplate/tilemaps/test.json");
    }

    public create(): void {
        this.map = this.add.tilemap("Tile Layer 1");
        var tileset = this.map.addTilesetImage("test", "tiles");
        this.backgroundLayer = this.map.createStaticLayer("Tile Layer 1", tileset);
    }
}
