import { SpaceScene } from './scenes/space-scene';

window.addEventListener('load', () => {
    (window as any).GAME = new Phaser.Game({
        width: window.innerWidth,
        height: window.innerHeight,
        // type: Phaser.CANVAS,
        type: Phaser.WEBGL,
        parent: 'game',
        scene: SpaceScene,
        render: {
            antialias: true,
        },
        input: {
            mouse: true,
        },
    });
});

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});