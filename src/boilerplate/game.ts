import { MainScene } from './scenes/main-scene';
import { SpaceScene } from './scenes/space-scene';

window.addEventListener('load', () => {
    // (window as any).GAME = new Phaser.Game({
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    //     // type: Phaser.CANVAS,
    //     type: Phaser.WEBGL,
    //     parent: 'game',
    //     scene: MainScene,
    //     render: {
    //         pixelArt: true,
    //     },
    //     input: {
    //         mouse: true,
    //     },
    // });
    (window as any).GAME = new Phaser.Game({
        width: window.innerWidth,
        height: window.innerHeight,
        // type: Phaser.CANVAS,
        type: Phaser.WEBGL,
        parent: 'game',
        scene: SpaceScene,
        render: {
        },
        input: {
            mouse: true,
        },
    });
});
