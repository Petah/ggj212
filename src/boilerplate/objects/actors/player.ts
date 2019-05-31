import { Actor } from './actor';
import { MainScene } from '../../scenes/main-scene';

export abstract class Player extends Actor {
    // Stats
    protected velocity: number = 0;

    // Input
    protected cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    public constructor(protected scene: MainScene) {
        super(scene);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    public update(): void {
        this.handleInput();
    }

    private handleInput() {
        // if (this.cursors.up.isDown) {
        //     this.body.setVelocityY(-160);
        // } else if (this.cursors.down.isDown) {
        //     this.body.setVelocityY(160);
        // } else if (this.cursors.left.isDown) {
        //     this.body.setVelocityX(-160);
        // } else if (this.cursors.right.isDown) {
        //     this.body.setVelocityX(160);
        // } else {
        //     this.body.setVelocity(0, 0);
        // }
    }
}
