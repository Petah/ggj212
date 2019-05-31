import Entity from '../entity';
import { MainScene } from '../../scenes/main-scene';
import Path from '../../services/path';

export abstract class Actor extends Entity {
    protected sprite: Phaser.GameObjects.Sprite;
    protected health: number = 100;
    protected race: string = 'human';

    public constructor(
        protected scene: MainScene,
        public type: string = 'actor',
    ) {
        super(scene, 'actor');
        this.sprite = this.scene.add.sprite(
            this.scene.input.activePointer.worldX,
            this.scene.input.activePointer.worldY,
            'light',
        );
    }

    public static preload(scene: MainScene): void {
        scene.load.image('light', Path.asset('lamp.png'));
    }
}
