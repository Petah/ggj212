import { IController } from './controller/controller';
import { IScene } from '../../scenes/scene-interface';
import { Ship } from '../actors/ship';
import { Input } from './controller/input';
import { Entity } from '../actors/entity';

export class PlayerShip extends Entity {
    private input: Input;

    constructor(
        scene: IScene,
        private ship: Ship,
        private controller: IController,
    ) {
        super(scene);
        this.input = this.ship.input;
    }

    public onInput() {
        this.controller.processInput(this.input);
    }
}
