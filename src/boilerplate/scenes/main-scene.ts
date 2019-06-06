import { Ui } from '../ui/ui';
import { Team } from '../objects/player/team';
import { LightMap } from '../objects/lighting/light-map';
import { Level } from './level';
import { Debug } from '../objects/debug-draw';
import { logDebug } from '../services/debug';
import { LightStatic } from '../objects/lighting/light-static';
import { SpawnPoint } from '../objects/spawn-point';
import { Actor } from '../objects/actors/actor';
import { Player } from '../objects/player/player';
import { EventGroup } from './event-group';
import { Wsad } from '../objects/player/controller/wsad';
import { WidgetMouse } from '../ui/types/mouse';

export class MainScene extends Phaser.Scene {
    private ui: Ui;
    private uiMouse: WidgetMouse;

    private backgroundTilesetName = 'space-station';
    private lightTilesetName = 'light';
    private backgroundLayerName = 'background';
    private lightLayerName = 'light';

    private level!: Level;

    public width!: number;
    public height!: number;

    public debug!: Debug;

    private teams: Team[] = [];
    private lightMap!: LightMap;
    private controls!: Phaser.Cameras.Controls.FixedKeyControl;

    private tilemap!: Phaser.Tilemaps.Tilemap;
    private backgroundTileset!: Phaser.Tilemaps.Tileset;
    private backgroundLayer!: Phaser.Tilemaps.DynamicTilemapLayer;

    public step = {
        input: new EventGroup<() => void>(),
        update: new EventGroup<(time: number, delta: number) => void>(),
    };

    public constructor() {
        super({
            key: 'MainScene',
        });
        (window as any).SCENE = this;

        this.ui = new Ui();
        this.uiMouse = this.ui.rightSidebar.addWidget(new WidgetMouse());
    }

    public preload(): void {
        this.load.image(this.backgroundTilesetName, './assets/space-station.png');
        this.load.image(this.lightTilesetName, './assets/light.png');
        this.load.tilemapTiledJSON(this.backgroundLayerName, './tilemaps/space-station.json');
        this.load.image('lamp', './assets/lamp.png');

        Actor.scenePreload(this);
    }

    public create(): void {
        logDebug('Scene create');

        this.tilemap = this.add.tilemap(this.backgroundLayerName);
        const backgroundTileset = this.tilemap.addTilesetImage(this.backgroundTilesetName, this.backgroundTilesetName);
        const backgroundLayer = this.tilemap.createDynamicLayer(this.backgroundLayerName, backgroundTileset, 0, 0);
        // const lightTileset = map.addTilesetImage(this.lightTilesetName, this.lightTilesetName);
        // const lightLayer = map.createStaticLayer(this.lightLayerName, lightTileset, 0, 0);

        this.debug = new Debug(this);

        this.width = this.tilemap.width;
        this.height = this.tilemap.height;
        this.lightMap = new LightMap(this, this.tilemap);

        Actor.sceneCreate(this);

        this.loadObjects();

        const camera = this.cameras.main;
        camera.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
        const cursors = this.input.keyboard.createCursorKeys();
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 16,
        });
    }

    public update(time: number, delta: number): void {
        this.uiMouse.update(this.input.activePointer.worldX, this.input.activePointer.worldY);
        this.controls.update(delta);
        this.debug.update();
        this.step.input.call();
        this.step.update.call();
    }

    private loadObjects() {
        const staticLights = [];
        for (const objectLayer of this.tilemap.objects) {
            for (const object of objectLayer.objects) {
                logDebug('Load tilemap object', object);
                switch (object.type) {
                    case 'light-static':
                        const staticLight = new LightStatic(object.x, object.y);
                        staticLights.push(staticLight);
                        break;
                    case 'spawn-point':
                        const spawnPoint = new SpawnPoint(object.x, object.y);
                        const actor = new Actor(this, object.x, object.y);
                        const player = new Player(this, actor, new Wsad(this));
                        break;
                }
            }
        }
        this.lightMap.setStaticLights(staticLights);
    }

}
