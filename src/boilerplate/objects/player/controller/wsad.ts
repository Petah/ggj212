import { IScene } from '../../../scenes/scene-interface';
import { Input } from './input';

export class Wsad {
    private wsad: {
        W: Phaser.Input.Keyboard.Key,
        S: Phaser.Input.Keyboard.Key,
        A: Phaser.Input.Keyboard.Key,
        D: Phaser.Input.Keyboard.Key,
    };

    constructor(
        protected scene: IScene,
    ) {
        this.wsad = scene.input.keyboard.addKeys('W,S,A,D');
    }

    public processInput(input: Input) {
        if (this.wsad.A.isDown) {
            input.turn = -1;
        } else if (this.wsad.D.isDown) {
            input.turn = 1;
        } else {
            input.turn = 0;
        }

        input.accelerate = 0;
        input.break = 0;
        if (this.wsad.W.isDown) {
            input.accelerate = 1;
        } else if (this.wsad.S.isDown) {
            input.break = 1;
        }
    }
}
