import { ICommand } from "./command";
import { Input } from "../../player/controller/input";
import { pointDirection, pointDistance } from "../../../services/math/vector";
import { Entity } from "../entity";
import { TURN_LEFT, TURN_RIGHT, TURN_STOP } from "../../player/controller/controller";
import { Debug } from "../../debug-draw";
import { logSample } from "../../../services/log";

export class MoveTo implements ICommand {
    public constructor(
        public x: number,
        public y: number,
    ) {

    }

    public processInput(input: Input, entity: Entity) {
        const direction = pointDirection(entity.x, entity.y, this.x, this.y);

        let directionDifference = direction - entity.direction;
        if (directionDifference < 0) {
            directionDifference += 360;
        }
        const minDifference = 2;
        if (directionDifference < minDifference || directionDifference > 360 - minDifference) {
            input.turn = TURN_STOP;
        } else if (directionDifference > 180) {
            input.turn = TURN_LEFT;
        } else {
            input.turn = TURN_RIGHT;
        }

        const distance = pointDistance(entity.x, entity.y, this.x, this.y);
        if (distance > 10) {
            if (entity.speed * 50 < distance) {
                input.accelerate = Math.min(1, distance / 250);
                logSample(input.accelerate, distance, distance / 250);
            }
        }
        // } else if (distance > 10) {
        //     if (this.speed > 1) {
        //         input.break = 1;
        //         input.accelerate = 0;
        //     } else {
        //         input.accelerate = 0.1;
        //     }
        // } else {
        //     input.break = 1;
        //     input.accelerate = 0;
        // }
        // console.log('moveTo', directionDifference, distance);
    }

    public onDebug(debug: Debug) {
        debug.drawCircle(this.x, this.y, 10, 0xff0000, 0.9, 1);
    }
}