import { Actor } from './actor';

export abstract class Player extends Actor {
    public activePlayer: boolean = false;

    // Stats
    public velocity: number;

    // Input
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    public create(params): void {
        super.create(params);

        this.velocity = params.velocity || 0;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    public update(): void {
        if (!this.active) {
            this.destroy();

            return;
        }

        // Only handle inputs for active players
        if (this.activePlayer) {
            this.handleInput();
        }
    }

    private handleInput() {
        if (this.cursors.up.isDown) {
            this.body.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.body.setVelocityY(160);
        } else if (this.cursors.left.isDown) {
            this.body.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.body.setVelocityX(160);
        } else {
            this.body.setVelocity(0, 0);
        }
    }
}
