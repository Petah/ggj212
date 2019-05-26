export abstract class Actor extends Phaser.GameObjects.GameObject {
    protected game: Phaser.Game;

    // Stats
    protected health: number;
    protected velocity: number;
    protected class: string;

    // Sprites
    protected sprite: Phaser.GameObjects.Sprite;

    // Input
    protected cursors: Phaser.Input.Keyboard.CursorKeys;

    constructor(params) {
        super(params.scene, params.type);

        this.game = params.game;
        this.create(params);
    }

    public preload(): void {

    }

    public create(params): void {
        this.health = params.health || 100;
        this.velocity = params.velocity || 0;
        this.class = params.class || "human";

        this.sprite = this.game.physics.add(
            params.originX,
            params.originY,
            params.spriteName,
        );
        this.sprite.setDepth(params.depth || 0);

        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    public update(): void {
        if (!this.active) {
            this.destroy();

            return;
        }

        this.handleInput();
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
