import Light from '../objects/lighting/light';
import { Ui } from '../ui/ui';
import Entity from '../objects/entity';
import { Team } from '../objects/player/team';
import { LightMap } from '../objects/lighting/light-map';
import { Level } from './level';
import { Debug } from '../objects/debug-draw';
import { logDebug } from '../services/debug';
import { LightStatic } from '../objects/lighting/light-static';
import { SpawnPoint } from '../objects/spawn-point';
import { Actor } from '../objects/actors/actor';

export class MainScene extends Phaser.Scene {
    private entities: Entity[] = [];
    private ui: Ui;
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
    public wsad!: {
        W: Phaser.Input.Keyboard.Key,
        S: Phaser.Input.Keyboard.Key,
        A: Phaser.Input.Keyboard.Key,
        D: Phaser.Input.Keyboard.Key,
    };

    public constructor() {
        super({
            key: 'MainScene',
        });
        (window as any).SCENE = this;
        this.ui = new Ui();
    }

    public preload(): void {
        this.load.image(this.backgroundTilesetName, './assets/space-station.png');
        this.load.image(this.lightTilesetName, './assets/light.png');
        this.load.tilemapTiledJSON(this.backgroundLayerName, './tilemaps/space-station.json');
        this.load.image('lamp', './assets/lamp.png');

        this.load.spritesheet('left_strip4', './assets/left_strip4.png', { frameWidth: 50, frameHeight: 54 });
        this.load.spritesheet('right_strip4', './assets/right_strip4.png', { frameWidth: 50, frameHeight: 54 });
        this.load.spritesheet('back_strip2', './assets/back_strip2.png', { frameWidth: 50, frameHeight: 54 });
        this.load.spritesheet('front_strip2', './assets/front_strip2.png', { frameWidth: 50, frameHeight: 54 });


        // let targetImg = this.add.sprite( position.x, position.y, 'target' );
        // targetImg.animations.add('animA',  [ 0, 1 ]);
        // targetImg.animations.add('animB',   [ 1, 2 ]);
        // targetImg.animations.play("animA", speed); // "plays" first frame
        // targetImg.animations.play("animB", speed, true); // "plays" second frame forever
    }

    public create(): void {
        logDebug('Scene create');

        this.anims.create({
            key: 'left_strip4_anim',
            frames: this.anims.generateFrameNumbers('left_strip4', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'right_strip4_anim',
            frames: this.anims.generateFrameNumbers('right_strip4', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'back_strip2_anim',
            frames: this.anims.generateFrameNumbers('back_strip2', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'front_strip2_anim',
            frames: this.anims.generateFrameNumbers('front_strip2', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1,
        });

        this.tilemap = this.add.tilemap(this.backgroundLayerName);
        const backgroundTileset = this.tilemap.addTilesetImage(this.backgroundTilesetName, this.backgroundTilesetName);
        const backgroundLayer = this.tilemap.createDynamicLayer(this.backgroundLayerName, backgroundTileset, 0, 0);
        // const lightTileset = map.addTilesetImage(this.lightTilesetName, this.lightTilesetName);
        // const lightLayer = map.createStaticLayer(this.lightLayerName, lightTileset, 0, 0);
        // this.cursors = this.input.keyboard.createCursorKeys();

        this.debug = new Debug(this);

        this.width = this.tilemap.width;
        this.height = this.tilemap.height;
        this.lightMap = new LightMap(this.tilemap);
        // this.debug.add(this.lightMap);
        this.loadObjects();
        // this.lightMap = new LightMap(map);
        // this.entities.push(new Light(this, map, this.backgroundLayer));

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

        this.wsad = this.input.keyboard.addKeys('W,S,A,D');
    }

    public update(time: number, delta: number): void {
        this.controls.update(delta);
        this.debug.update();
        for (const entity of this.entities) {
            entity.update();
        }
        // this.input.keyboard.
        // if (this.cursors.up.isDown) {
        //     this.cameras.main.y += 16;
        // } else if (this.cursors.down.isDown) {
        //     this.cameras.main.y -= 16;
        // } else if (this.cursors.left.isDown) {
        //     this.cameras.main.x -= 16;
        // } else if (this.cursors.right.isDown) {
        //     this.cameras.main.x += 16;
        // }
    }

    public addEntity(entity: Entity) {
        this.entities.push(entity);
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
                        this.addEntity(new Actor(this, object.x, object.y));
                        break;
                }
            }
        }
        this.lightMap.setStaticLights(staticLights);
    }

}
