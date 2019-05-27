import "phaser";
import { scenes } from "./scenes/scenes";

// main game configuration
const config: GameConfig = {
    width: 1200,
    height: 800,
    type: Phaser.WEBGL,
    parent: "game",
    scene: scenes,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 }
        }
    },
    input: {
        mouse: true,
    },
};

// game class
export class Game extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
    var game = new Game(config);
});
