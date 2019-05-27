import { MainScene } from "./scenes/main-scene";

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.WEBGL,
    parent: "game",
    scene: MainScene,
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
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
    var game = new Game(config);
});

