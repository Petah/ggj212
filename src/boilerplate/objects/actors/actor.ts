import Entity from '../entity';
import { MainScene } from '../../scenes/main-scene';
import Path from '../../services/path';

export class Actor extends Entity {
    protected frontSprite: Phaser.GameObjects.Sprite;
    protected backSprite: Phaser.GameObjects.Sprite;
    protected leftSprite: Phaser.GameObjects.Sprite;
    protected rightSprite: Phaser.GameObjects.Sprite;
    protected health: number = 100;
    protected race: string = 'human';

    public constructor(
        protected scene: MainScene,
        private x: number,
        private y: number,
    ) {
        super(scene, 'actor');
        this.frontSprite = this.scene.add.sprite(
            x,
            y,
            'front_strip2',
        );
        this.frontSprite.anims.load('front_strip2_anim');

        this.backSprite = this.scene.add.sprite(
            x,
            y,
            'back_strip2',
        );
        this.backSprite.anims.load('back_strip2_anim');

        this.leftSprite = this.scene.add.sprite(
            x,
            y,
            'left_strip4',
        );
        this.leftSprite.anims.load('left_strip4_anim');

        this.rightSprite = this.scene.add.sprite(
            x,
            y,
            'right_strip4',
        );
        this.rightSprite.anims.load('right_strip4_anim');
    }

    public update(time: number, delta: number): void {
        this.backSprite.visible = this.scene.wsad.W.isDown;
        this.frontSprite.visible = this.scene.wsad.S.isDown;
        this.leftSprite.visible = this.scene.wsad.A.isDown;
        this.rightSprite.visible = this.scene.wsad.D.isDown;
    }

}
