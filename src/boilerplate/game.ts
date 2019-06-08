import { MainScene } from './scenes/main-scene';
import { Team } from './objects/player/team';

const config: Phaser.Types.Core.GameConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    // type: Phaser.CANVAS,
    type: Phaser.WEBGL,
    parent: 'game',
    scene: MainScene,
    render: {
        pixelArt: true,
    },
    input: {
        mouse: true,
    },
};

export class Game extends Phaser.Game {
    public constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener('load', () => {
    const game = new Game(config);
});
