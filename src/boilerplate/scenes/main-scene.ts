import { Ui } from '../ui/ui';
import { Team } from '../objects/player/team';
import { LightMap } from '../objects/lighting/light-map';
import { Debug } from '../objects/debug-draw';
import { logDebug, logSettings } from '../services/log';
import { LightStatic } from '../objects/lighting/light-static';
import { SpawnPoint } from '../objects/spawn-point';
import { Actor } from '../objects/actors/actor';
import { Player } from '../objects/player/player';
import { EventGroup } from './event-group';
import { Wsad } from '../objects/player/controller/wsad';
import { WidgetDebug } from '../ui/types/debug';
import { LocalStorage } from '../services/local-storage';
import { CollisionMap } from '../objects/collision/collision-map';
import { TimerAverage } from '../services/timer-average';
import { Depth } from '../services/depth';
import { LightMapWall } from '../objects/lighting/light-map-wall';

export class MainScene extends Phaser.Scene {
    private ui: Ui;
    public uiDebug: WidgetDebug;

    private spaceStationTilesetName = 'space-station';
    private lightTilesetName = 'light';
    private backgroundLayerName = 'background';
    private foregroundLayerName = 'foreground';
    private lightLayerName = 'light';
    private tilemap!: Phaser.Tilemaps.Tilemap;

    public width!: number;
    public height!: number;

    public debug!: Debug;
    public debugEnabled: boolean = false;

    public frame = 0;
    private timers = {
        update: new TimerAverage(),
        debug: new TimerAverage(),
        input: new TimerAverage(),
        collision: new TimerAverage(),
    };

    private teams: Team[] = [];
    public lightMap!: LightMap | LightMapWall;
    public lightMapWall!: LightMapWall;
    public collisionMap!: CollisionMap;

    private paused = false;

    public step = {
        input: new EventGroup<() => void>(this, this.timers.input),
        update: new EventGroup<(time: number, delta: number) => void>(this, this.timers.update),
        debug: new EventGroup<(debug: Debug) => void>(this, this.timers.debug),
        collision: new EventGroup<(time: number, delta: number) => void>(this, this.timers.collision),
    };
    public storage: LocalStorage;

    public constructor() {
        super({
            key: 'MainScene',
        });
        (window as any).SCENE = this;

        this.storage = new LocalStorage();
        this.debugEnabled = this.storage.get('debug', false);
        logSettings.debug = this.debugEnabled;

        this.ui = new Ui();
        this.uiDebug = this.ui.rightSidebar.addWidget(new WidgetDebug(this));
    }

    public preload(): void {
        this.load.image(this.spaceStationTilesetName, './assets/space-station.png');
        this.load.image(this.lightTilesetName, './assets/light.png');
        this.load.tilemapTiledJSON(this.backgroundLayerName, './tilemaps/space-station.json');
        this.load.image('lamp', './assets/lamp.png');

        Actor.scenePreload(this);
    }

    public create(): void {
        logDebug('Scene create');

        this.input.keyboard.on('keyup', (event: KeyboardEvent) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.PAUSE) {
                this.paused = !this.paused;
            }

        });

        this.tilemap = this.add.tilemap(this.backgroundLayerName);
        const backgroundTileset = this.tilemap.addTilesetImage(this.spaceStationTilesetName, this.spaceStationTilesetName);
        const backgroundLayer = this.tilemap.createDynamicLayer(this.backgroundLayerName, backgroundTileset, 0, 0);
        const foregroundTileset = this.tilemap.addTilesetImage(this.spaceStationTilesetName, this.spaceStationTilesetName);
        const foregroundLayer = this.tilemap.createDynamicLayer(this.foregroundLayerName, foregroundTileset, 0, 0);
        foregroundLayer.depth = Depth.FOREGROUND;

        const lightTileset = this.tilemap.addTilesetImage(this.lightTilesetName, this.lightTilesetName);
        const lightLayer = this.tilemap.createStaticLayer('light', lightTileset, 0, 0);
        lightLayer.depth = Depth.DEBUG;
        lightLayer.visible = false;
        const shadowLayer = this.tilemap.createDynamicLayer('shadow', lightTileset, 0, 0);
        shadowLayer.depth = Depth.SHADOW;

        this.cameras.main.setBackgroundColor('#66ff66');
        this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);

        this.debug = new Debug(this);

        this.width = this.tilemap.width;
        this.height = this.tilemap.height;
        // this.lightMap = new LightMap(this, this.tilemap, lightLayer, shadowLayer);
        this.lightMap = new LightMapWall(this, this.tilemap, shadowLayer);

        this.collisionMap = new CollisionMap(this, this.tilemap);

        Actor.sceneCreate(this);

        this.loadObjects();
    }

    public update(time: number, delta: number): void {
        if (this.paused) {
            return;
        }

        this.frame++;
        this.uiDebug.updateMouse(this.input.activePointer.worldX, this.input.activePointer.worldY);

        this.step.input.call();
        this.step.update.call();
        this.step.collision.call();
        if (this.debugEnabled) {
            this.step.debug.call(this.debug);
        }
    }

    private loadObjects() {
        for (const objectLayer of this.tilemap.objects) {
            if (objectLayer.name === 'spawns') {
                this.loadObjectSpawns(objectLayer);
            }
        }
    }

    private loadObjectSpawns(objectLayer: Phaser.Tilemaps.ObjectLayer) {
        const staticLights = [];
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
                    this.collisionMap.addCollidable(actor);

                    const player = new Player(this, actor, new Wsad(this));
                    break;
                default:
                    logDebug('Unknown object type', object);
            }
        }
        this.lightMap.setStaticLights(staticLights);
    }
}
