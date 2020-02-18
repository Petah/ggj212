import { IScene } from '../../scenes/scene-interface';
import { Collidable } from './collidable';
import { Debug } from '../debug-draw';
import { ICommand } from './commands/command';

export abstract class Entity {
    public id: number;
    public gameObjects: Phaser.GameObjects.GameObject[] = [];
    public commands: ICommand[] = [];
    public direction: number = 0;
    public speed: number = 0;

    public constructor(
        protected scene: IScene,
        public x: number = 0,
        public y: number = 0,
    ) {
        this.id = this.scene.addEntity(this);
    }

    public onDebug?(debug: Debug): void;
    public onInput?(): void;
    public onUpdate?(time: number, delta: number): void;
    public onDraw?(): void;
    public onCollide?(entity: Collidable): boolean;

    protected addSprite(x: number, y: number, spriteName: string, depth: number): Phaser.GameObjects.Sprite {
        const sprite = this.scene.add.sprite(x, y, spriteName);
        sprite.depth = depth;
        sprite.setOrigin(0.5, 0.5);
        this.gameObjects.push(sprite);
        return sprite;
    }

    public destroy(): void {
        this.scene.destroyEntity(this);
    }
}
