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
        if (input.xAxis || input.yAxis) {
            this.ship.facing = pointDirection(0, 0, input.xAxis, input.yAxis);
        }
        this.ship.currentAcceleration = pointDistance(0, 0, input.xAxis, input.yAxis) * this.ship.maxSpeed;
    }
}
