import Entity from "../entity";

export abstract class Actor extends Entity {
    // Physics
    body: Phaser.Physics.Arcade.Body;

    // Stats
    health: number;
    class: string;

    public create(params): void {
        this.health = params.health || 100;
        this.class = params.class || "human";
    }

    public update(): void {
        if (!this.active) {
            this.destroy();

            return;
        }
    }
}
