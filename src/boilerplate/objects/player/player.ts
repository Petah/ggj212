import { IController } from './controller/controller';
import { Actor } from '../actors/actor';
import { pointDirection, pointDistance } from '../../services/math/vector';
import { IScene } from '../../scenes/scene-interface';
import { Entity } from '../actors/entity';

export class Player extends Entity {
    constructor(
        scene: IScene,
        private actor: Actor,
        private controller: IController,
    ) {
        super(scene);
    }

    public onInput() {
        // const input = this.controller.getInput();
        // this.actor.direction = pointDirection(0, 0, input.xAxis, input.yAxis);
        // this.actor.speed = pointDistance(0, 0, input.xAxis, input.yAxis) * this.actor.maxSpeed;
    }
}
