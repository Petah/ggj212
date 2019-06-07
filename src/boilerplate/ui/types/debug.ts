import { MainScene } from '../../scenes/main-scene';

export class WidgetDebug {
    public readonly id = 'mouse';
    public readonly type = 'WidgetDebug';

    constructor(
        public readonly scene: MainScene,
    ) {

    }

    public updateMouse!: (mouseX: number, mouseY: number) => void;

    public updateCollision!: (collision: boolean) => void;
}
