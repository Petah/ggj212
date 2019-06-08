import { MainScene } from '../../scenes/main-scene';
import { lengthDirX, lengthDirY, pointDirection } from '../../services/math/vector';
import { Entity } from '../entity';
import { Light } from '../lighting/light';
import { ICollidable } from '../collision/collision-map';
import { ILightable } from '../lighting/light-map';

declare interface IActorSprite {
    sprite: Phaser.GameObjects.Sprite;
    animation: string;
}

export class Actor implements ICollidable, ILightable {
    private baseSprite: Phaser.GameObjects.Sprite;
    private frontSprite: IActorSprite;
    private backSprite: IActorSprite;
    private leftSprite: IActorSprite;
    private rightSprite: IActorSprite;
    public currentSprite: IActorSprite;
    private animationPlaying: boolean = false;
    private health: number = 100;
    private race: string = 'human';
    private light: Light;
    public tint: number = 0xffffff;

    public maxSpeed = 5;
    public speed: number = 0;
    public direction: number = 0;

    public constructor(
        protected scene: MainScene,
        public x: number,
        public y: number,
    ) {
        // @todo need to remove events on destroy
        scene.step.update.add(this.update.bind(this));
        this.baseSprite = this.scene.add.sprite(this.x, this.y, 'front');
        this.frontSprite = this.loadSprite('front_strip2');
        this.backSprite = this.loadSprite('back_strip2');
        this.leftSprite = this.loadSprite('left_strip4');
        this.rightSprite = this.loadSprite('right_strip4');

        this.light = new Light(scene, this.x, this.y);

        this.currentSprite = this.frontSprite;
        this.currentSprite.sprite.visible = true;
        this.scene.cameras.main.startFollow(this.baseSprite, true, 0.1, 0.1);
    }

    private loadSprite(name: string): IActorSprite {
        const sprite = this.scene.add.sprite(this.x, this.y, name);
        sprite.anims.load(name + '_anim');
        sprite.visible = false;
        return {
            sprite,
            animation: name + '_anim',
        };
    }

    public static scenePreload(scene: MainScene): void {
        scene.load.image('front', './assets/front.png');
        scene.load.spritesheet('left_strip4', './assets/left_strip4.png', { frameWidth: 50, frameHeight: 54 });
        scene.load.spritesheet('right_strip4', './assets/right_strip4.png', { frameWidth: 50, frameHeight: 54 });
        scene.load.spritesheet('back_strip2', './assets/back_strip2.png', { frameWidth: 50, frameHeight: 54 });
        scene.load.spritesheet('front_strip2', './assets/front_strip2.png', { frameWidth: 50, frameHeight: 54 });
    }

    public static sceneCreate(scene: MainScene): void {
        scene.anims.create({
            key: 'left_strip4_anim',
            frames: scene.anims.generateFrameNumbers('left_strip4', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        scene.anims.create({
            key: 'right_strip4_anim',
            frames: scene.anims.generateFrameNumbers('right_strip4', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        scene.anims.create({
            key: 'back_strip2_anim',
            frames: scene.anims.generateFrameNumbers('back_strip2', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1,
        });
        scene.anims.create({
            key: 'front_strip2_anim',
            frames: scene.anims.generateFrameNumbers('front_strip2', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1,
        });
    }

    public update(time: number, delta: number) {
        if (this.speed > 0) {
            const spriteDirection = this.direction / 90;
            let sprite = null;
            if (spriteDirection < 1) {
                sprite = this.rightSprite;
            } else if (spriteDirection < 1.5) {
                sprite = this.frontSprite;
            } else if (spriteDirection < 3) {
                sprite = this.leftSprite;
            } else if (spriteDirection < 3.5) {
                sprite = this.backSprite;
            } else {
                sprite = this.rightSprite;
            }
            if (this.currentSprite !== sprite) {
                this.animationPlaying = false;
                this.currentSprite.sprite.visible = false;

                this.currentSprite = sprite;
                this.currentSprite.sprite.visible = true;
                this.currentSprite.sprite.x = this.x;
                this.currentSprite.sprite.y = this.y;
            }
            if (!this.animationPlaying) {
                this.animationPlaying = true;
                this.currentSprite.sprite.anims.play(this.currentSprite.animation);
            }

            this.scene.collisionMap.move(this);
            this.currentSprite.sprite.x = this.x;
            this.currentSprite.sprite.y = this.y;
            this.baseSprite.x = this.x;
            this.baseSprite.y = this.y;
        } else {
            if (this.animationPlaying) {
                this.animationPlaying = false;
                this.currentSprite.sprite.anims.stop();
            }
        }

        this.currentSprite.sprite.tint = this.tint;
        this.light.x = this.x;
        this.light.y = this.y;
    }

    public get collisionPolygons() {
        const width = this.currentSprite.sprite.width / 3;
        const height = this.currentSprite.sprite.height / 6;
        return [
            [
                { x: -width, y: -height + 10 },
                { x: width, y: -height + 10 },
                { x: width, y: height + 10 },
                { x: -width, y: height + 10 },
            ],
        ];
    }
}
