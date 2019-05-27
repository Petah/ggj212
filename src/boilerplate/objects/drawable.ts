import Entity from "./entity";

export default abstract class Drawable extends Entity {
    y: number;
    x: number;
    texture: string;
    frame: string;

    sprite: Phaser.GameObjects.Sprite;

    create(params): void {
        super.create(params);

        this.sprite = this.scene.add.sprite(this.x, this.y, this.texture, this.frame);
    }
}
