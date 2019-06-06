import { MainScene } from '../../scenes/main-scene';
import Path from '../../services/path';
import { pointDirection, lengthDirX, lengthDirY } from '../../services/math/vector';
import { Entity } from '../entity';
import { ICollidable } from '../../interfaces/collidable.interface';

declare interface ActorSprite {
    sprite: Phaser.GameObjects.Sprite;
    animation: string;
}

export class Actor extends Entity implements ICollidable {
    private frontSprite: ActorSprite;
    private backSprite: ActorSprite;
    private leftSprite: ActorSprite;
    private rightSprite: ActorSprite;
    public currentSprite: ActorSprite;
    private animationPlaying: boolean = false;
    private health: number = 100;
    private race: string = 'human';
    private maxSpeed = 5;

    public speed: number = 0;
    public direction: number = 0;

    public constructor(
        protected scene: MainScene,
        private x: number,
        private y: number,
    ) {
        super(scene, 'actor');
        // @todo need to remove events on destroy
        scene.step.update.add(this.update.bind(this));
        this.frontSprite = this.loadSprite('front_strip2');
        this.backSprite = this.loadSprite('back_strip2');
        this.leftSprite = this.loadSprite('left_strip4');
        this.rightSprite = this.loadSprite('right_strip4');

        this.currentSprite = this.frontSprite;
        this.currentSprite.sprite.visible = true;
    }

    private loadSprite(name: string): ActorSprite {
        const sprite = this.scene.add.sprite(
            this.x,
            this.y,
            name,
        );
        sprite.anims.load(name + '_anim');
        sprite.visible = false;
        return {
            sprite,
            animation: name + '_anim',
        };
    }

    public static scenePreload(scene: MainScene): void {
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
            }
            if (!this.animationPlaying) {
                this.animationPlaying = true;
                this.currentSprite.sprite.anims.play(this.currentSprite.animation);
            }

            this.x += lengthDirX(this.maxSpeed * this.speed, this.direction);
            this.y += lengthDirY(this.maxSpeed * this.speed, this.direction);
            this.currentSprite.sprite.x = this.x;
            this.currentSprite.sprite.y = this.y;
        } else {
            if (this.animationPlaying) {
                this.animationPlaying = false;
                this.currentSprite.sprite.anims.stop();
            }
        }
    }

    public getPosition() {
        return {
            x: this.x,
            y: this.y,
        };
    }

    public getCollisionPolygons() {
        return [
            [
                {
                    x: this.currentSprite.sprite.x,
                    y: this.currentSprite.sprite.y,
                },
                {
                    x: this.currentSprite.sprite.x + this.currentSprite.sprite.width,
                    y: this.currentSprite.sprite.y,
                },
                {
                    x: this.currentSprite.sprite.x + this.currentSprite.sprite.width,
                    y: this.currentSprite.sprite.y + this.currentSprite.sprite.height,
                },
                {
                    x: this.currentSprite.sprite.x,
                    y: this.currentSprite.sprite.y + this.currentSprite.sprite.height,
                },
            ],
        ];
    }
}
