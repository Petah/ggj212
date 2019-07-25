import { IController } from './controller/controller';
import { IScene } from '../../scenes/scene-interface';
import { Ship } from '../actors/ship';
import { Input } from './controller/input';

export class PlayerShip {
    private input: Input;

    constructor(
        private scene: IScene,
        private ship: Ship,
        private controller: IController,
    ) {
        scene.step.input.add(this.update.bind(this));
        this.input = this.ship.input;
    }

    public update() {
        this.controller.processInput(this.input);
    }
}
