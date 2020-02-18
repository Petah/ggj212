import { Ui } from '../ui/ui';
import { Team } from '../objects/player/team';
import { Debug } from '../objects/debug-draw';
import { logDebug, logSettings, logSample } from '../services/log';
import { EventGroup } from './event-group';
import { LocalStorage } from '../services/local-storage';
import { TimerAverage } from '../services/timer-average';
import { IScene } from './scene-interface';
import { Ship } from '../objects/actors/ship';
import { PlayerShip } from '../objects/player/player-ship';
import WidgetDebug from '../ui/widgets/debug.vue';
import WidgetShip from '../ui/widgets/ship.vue';
import { preloadCallbacks } from './preload';
import { Astroid } from '../objects/actors/astroid';
import { randomBetween } from '../services/math/random';
import { Entity } from '../objects/actors/entity';
import { Collidable } from '../objects/actors/collidable';
import { KeyboardMouse } from '../objects/player/controller/keyboard-mouse';

interface StepInterface {
    onCollision: EventGroup<() => void>;
    onDebug: EventGroup<(debug: Debug) => void>;
    onDraw: EventGroup<() => void>;
    onInput: EventGroup<() => void>;
    onUpdate: EventGroup<(time: number, delta: number) => void>;
}

export class SpaceScene extends Phaser.Scene implements IScene {
    private ui: Ui;
    public uiDebug: WidgetDebug;
    public uiShip: WidgetShip;

    public width!: number;
    public height!: number;

    public debug!: Debug;
    public debugEnabled: boolean = false;

    public updates = 0;
    public updatesPerSecond = 0;
    public lastUpdateSecond = 0;
    public updatesLastSecond = 0;

    private timers = {
        update: new TimerAverage(),
        draw: new TimerAverage(),
        debug: new TimerAverage(),
        input: new TimerAverage(),
        collision: new TimerAverage(),
    };

    private teams: Team[] = [];

    private paused = false;

    public stepEvents: StepInterface = {
        onCollision: new EventGroup<() => void>(this, this.timers.collision),
        onDebug: new EventGroup<(debug: Debug) => void>(this, this.timers.debug),
        onDraw: new EventGroup<() => void>(this, this.timers.draw),
        onInput: new EventGroup<() => void>(this, this.timers.input),
        onUpdate: new EventGroup<(time: number, delta: number) => void>(this, this.timers.update),
    };

    public storage: LocalStorage;

    public entities: { [id: number]: Entity } = {};
    public collidables: { [id: number]: Collidable } = {};
    private nextEntityId = 1;
    private destroyEntitiesStack: Entity[] = [];

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

        // this.cameras.main.setBackgroundColor('#66ff66');
        this.cameras.main.setBackgroundColor('#000000');

        this.input.on('wheel', (pointer, currentlyOver, dx, dy, dz, event) => {
            const zoomSpeed = 1.1;
            if (dy > 0) {
                this.cameras.main.zoom /= zoomSpeed;
            } else if (dy < 0) {
                this.cameras.main.zoom *= zoomSpeed;
            }
            if (this.cameras.main.zoom > 1) {
                this.cameras.main.zoom = 1;
            }
        });

        this.debug = new Debug(this);

        this.width = 10000;
        this.height = 10000;

        this.loadObjects();

        const timedEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                const astroid = new Astroid(this, randomBetween(-1000, 1000), randomBetween(-1000, 1000));
            },
            loop: true,
        });
    }

    public update(time: number, delta: number): void {
        if (this.paused) {
            return;
        }

        this.updates++;
        this.updatesLastSecond++;
        if (this.lastUpdateSecond < time) {
            this.lastUpdateSecond = time + 1000;
            this.updatesPerSecond = this.updatesLastSecond;
            this.updatesLastSecond = 0;
        }
        this.uiDebug.updateMouse(this.input.activePointer.worldX, this.input.activePointer.worldY);

        this.stepEvents.onInput.call();
        this.stepEvents.onUpdate.call(time, delta / 1000);

        this.timers.collision.start();
        // @todo check if there is a faster way to get object values for this case
        const collidables = Object.values(this.collidables);
        for (let a = 0; a < collidables.length; a++) {
            for (let b = a + 1; b < collidables.length; b++) {
                const dx = collidables[a].x - collidables[b].x;
                const dy = collidables[a].y - collidables[b].y;
                const distance = dx * dx + dy * dy;
                if (distance < ((collidables[a].collisionRadius + collidables[b].collisionRadius) * (collidables[a].collisionRadius + collidables[b].collisionRadius))) {
                    if (!collidables[a].onCollide(collidables[b])) {
                        collidables[b].onCollide(collidables[a]);
                    }
                }
            }
        }
        this.timers.collision.stop();

        for (const entity of this.destroyEntitiesStack) {
            delete this.entities[entity.id];
            delete this.collidables[entity.id];

            for (const event in this.stepEvents) {
                if (entity[event]) {
                    this.stepEvents[event].remove(entity.id);
                }
            }
            for (const gameObject of entity.gameObjects) {
                gameObject.destroy();
            }
        }
        this.destroyEntitiesStack = [];

        // @todo only call draw on things in the camera view
        this.stepEvents.onDraw.call();

        // var circle1 = {radius: 20, x: 5, y: 5};
        // var circle2 = {radius: 12, x: 10, y: 5};

        // var dx = circle1.x - circle2.x;
        // var dy = circle1.y - circle2.y;
        // var distance = Math.sqrt(dx * dx + dy * dy);

        // if (distance < circle1.radius + circle2.radius) {
        //     // collision detected!
        // }
        // this.stepEvents.collision.call();
        if (this.debugEnabled) {
            this.stepEvents.onDebug.call(this.debug);
        }
    }

    private loadObjects() {
        const ship = new Ship(this, 100, 100);
        const player = new PlayerShip(this, ship, new KeyboardMouse(this));
        this.uiShip.ship = ship;
    }

    public addEntity(entity: Entity): number {
        const id = this.nextEntityId;
        this.nextEntityId++;

        this.entities[id] = entity;
        for (const event in this.stepEvents) {
            if (entity[event]) {
                this.stepEvents[event].add(id, entity[event].bind(entity));
            }
        }
        // if (entity.onCollide) {
        //     this.collidables[id] = entity;
        // }
        return id;
    }

    public destroyEntity<T>(entity: Entity): void {
        this.destroyEntitiesStack.push(entity);
    }
}
