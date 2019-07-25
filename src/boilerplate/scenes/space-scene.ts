import { Ui } from '../ui/ui';
import { Team } from '../objects/player/team';
import { Debug } from '../objects/debug-draw';
import { logDebug, logSettings } from '../services/log';
import { EventGroup } from './event-group';
import { Wsad } from '../objects/player/controller/wsad';
import { LocalStorage } from '../services/local-storage';
import { TimerAverage } from '../services/timer-average';
import { IScene } from './scene-interface';
import { Ship } from '../objects/actors/ship';
import { PlayerShip } from '../objects/player/player-ship';
import WidgetDebug from '../ui/widgets/debug.vue';
import WidgetShip from '../ui/widgets/ship.vue';
import { preloadCallbacks } from './preload';

export class SpaceScene extends Phaser.Scene implements IScene {
    private ui: Ui;
    public uiDebug: WidgetDebug;
    public uiShip: WidgetShip;

    public width!: number;
    public height!: number;

    public debug!: Debug;
    public debugEnabled: boolean = false;

    public frame = 0;
    private timers = {
        update: new TimerAverage(),
        debug: new TimerAverage(),
        input: new TimerAverage(),
        collision: new TimerAverage(),
    };

    private teams: Team[] = [];

    private paused = false;

    public step = {
        input: new EventGroup<() => void>(this, this.timers.input),
        update: new EventGroup<(time: number, delta: number) => void>(this, this.timers.update),
        debug: new EventGroup<(debug: Debug) => void>(this, this.timers.debug),
        collision: new EventGroup<(time: number, delta: number) => void>(this, this.timers.collision),
    };
    public storage: LocalStorage;

    public constructor() {
        super({
            key: 'MainScene',
        });
        (window as any).SCENE = this;

        this.storage = new LocalStorage();
        this.debugEnabled = this.storage.get('debug', false);
        logSettings.debug = this.debugEnabled;

        this.ui = new Ui();
        this.uiDebug = this.ui.rightSidebar.addWidget(WidgetDebug, {
            scene: this,
        });
        this.uiShip = this.ui.rightSidebar.addWidget(WidgetShip, {
            scene: this,
        });
    }

    public preload(): void {
        for (const callback of preloadCallbacks) {
            callback(this);
        }
    }

    public create(): void {
        logDebug('Scene create');

        this.input.keyboard.on('keyup', (event: KeyboardEvent) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.PAUSE) {
                this.paused = !this.paused;
            }

        });

        this.cameras.main.setBackgroundColor('#66ff66');

        this.debug = new Debug(this);

        this.width = 10000;
        this.height = 10000;

        this.loadObjects();
    }

    public update(time: number, delta: number): void {
        if (this.paused) {
            return;
        }

        this.frame++;
        this.uiDebug.updateMouse(this.input.activePointer.worldX, this.input.activePointer.worldY);

        this.step.input.call();
        this.step.update.call();
        this.step.collision.call();
        if (this.debugEnabled) {
            this.step.debug.call(this.debug);
        }
    }

    private loadObjects() {
        const ship = new Ship(this, 100, 100);
        const player = new PlayerShip(this, ship, new Wsad(this));
        this.uiShip.ship = ship;
    }
}
