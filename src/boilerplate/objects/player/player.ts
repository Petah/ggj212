import { IController } from './controller/controller';
import { Actor } from '../actors/actor';
import { pointDirection, pointDistance } from '../../services/math/vector';
import { MainScene } from '../../scenes/main-scene';

export class Player {
    constructor(
        private scene: MainScene,
        private actor: Actor,
        private controller: IController,
    ) {
        scene.step.input.add(this.update.bind(this));
    }

    public update() {
        const input = this.controller.getInput();
        this.actor.direction = pointDirection(0, 0, input.xAxis, input.yAxis);
        this.actor.speed = pointDistance(0, 0, input.xAxis, input.yAxis) * this.actor.maxSpeed;
    }
}
