import { MainScene } from './scenes/main-scene';
import { testLight } from './objects/lighting/wall-tracking/main';

window.addEventListener('load', () => {
    // testLight();
    (window as any).GAME = new Phaser.Game({
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
    });
});
