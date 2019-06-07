import { MainScene } from '../../../scenes/main-scene';
import { ControllerInput } from './controller';

export class Wsad {
    private wsad: {
        W: Phaser.Input.Keyboard.Key,
        S: Phaser.Input.Keyboard.Key,
        A: Phaser.Input.Keyboard.Key,
        D: Phaser.Input.Keyboard.Key,
    };

    constructor(
        protected scene: MainScene,
    ) {
        this.wsad = scene.input.keyboard.addKeys('W,S,A,D');
    }

    public getInput(): ControllerInput {
        let xAxis = 0;
        if (this.wsad.A.isDown) {
            xAxis = -1;
        } else if (this.wsad.D.isDown) {
            xAxis = 1;
        }
        let yAxis = 0;
        if (this.wsad.W.isDown) {
            yAxis = -1;
        } else if (this.wsad.S.isDown) {
            yAxis = 1;
        }
        return {
            xAxis,
            yAxis,
        };
    }
}
