import { IScene } from '../../../scenes/scene-interface';
import { Input } from './input';
import { MoveTo } from '../../actors/commands/move-to';
import { Entity } from '../../actors/entity';
import { TURN_LEFT, TURN_RIGHT } from './controller';

export class KeyboardMouse {
    private wsad: {
        W: Phaser.Input.Keyboard.Key,
        S: Phaser.Input.Keyboard.Key,
        A: Phaser.Input.Keyboard.Key,
        D: Phaser.Input.Keyboard.Key,
        SPACE: Phaser.Input.Keyboard.Key,
    };

    constructor(
        protected scene: IScene,
    ) {
        this.wsad = scene.input.keyboard.addKeys('W,S,A,D,SPACE');
    }

    public processInput(input: Input, entity: Entity) {
        this.processDirectControl(input);

        if (this.rightButtonDown) {
            input.commands = [
                new MoveTo(this.mouseX, this.mouseY),
            ];
        }

        for (const command of input.commands) {
            command.processInput(input, entity);
        }
    }

    private processDirectControl(input: Input) {
        if (this.wsad.A.isDown) {
            input.turn = TURN_LEFT;
        } else if (this.wsad.D.isDown) {
            input.turn = TURN_RIGHT;
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

        input.shoot = this.wsad.SPACE.isDown ? 1 : 0;
    }

    private get mouseX() {
        return this.scene.input.activePointer.worldX;
    }

    private get mouseY() {
        return this.scene.input.activePointer.worldY;
    }

    private get leftButtonDown() {
        return this.scene.input.activePointer.leftButtonDown();
    }

    private get rightButtonDown() {
        return this.scene.input.activePointer.rightButtonDown();
    }
}
