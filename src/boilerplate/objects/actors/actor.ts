import Drawable from "../drawable";

export abstract class Actor extends Drawable {
    activeActor: boolean = false;

    // Stats
    health: number;
    velocity: number;
    class: string;

    // Input
    cursors: Phaser.Input.Keyboard.CursorKeys;

    public create(params): void {
        this.health = params.health || 100;
        this.velocity = params.velocity || 0;
        this.class = params.class || "human";
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    public update(): void {
        if (!this.active) {
            this.destroy();

            return;
        }

        // Only handle inputs for active players
        if (this.activeActor) {
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
