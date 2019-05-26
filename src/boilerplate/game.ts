import "phaser";
import { scenes } from "./scenes/scenes";

// game class
export class Game extends Phaser.Game {
    private defaultConfig: GameConfig = {
        width: 1200,
        height: 800,
        type: Phaser.AUTO,
        parent: "game",
        scene: scenes,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 200 }
            }
        }
    };

    constructor(config: GameConfig) {
        super(config);
    }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
    var game = new Game(config);
});
