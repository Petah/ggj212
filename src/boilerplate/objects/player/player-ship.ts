import { IController } from './controller/controller';
import { pointDirection, pointDistance } from '../../services/math/vector';
import { IScene } from '../../scenes/scene-interface';
import { Ship } from '../actors/ship';
import { logSample } from '../../services/log';

export class PlayerShip {
    constructor(
        private scene: IScene,
        private ship: Ship,
        private controller: IController,
    ) {
        scene.step.input.add(this.update.bind(this));
    }

    public update() {
        const input = this.controller.getInput();
        this.ship.facing += input.xAxis * this.ship.turnSpeed;
        this.ship.currentAcceleration = 0;
        if (input.yAxis < 0) {
            this.ship.currentAcceleration = -input.yAxis * this.ship.accelerationSpeed;
        }
    }
}
