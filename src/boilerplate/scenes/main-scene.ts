import Light from '../objects/lighting/light';
import Scene from './scene';

declare var Vue: any;

export class MainScene extends Scene {
    public constructor() {
        super({
            key: 'MainScene',
        });
        (window as any).SCENE = this;

        Vue.component('list', {
            template: '#list-template',
            data() {
                return {
                    widgets: [
                        {
                            id: 'mouse',
                            type: 'widget-mouse',
                            mouseX: null,
                            mouseY: null,
                        },
                    ],
                };
            },
            methods: {
                addWidget(widget) {
                    this.widgets.push(widget);
                    setTimeout(() => {
                        for (const key in widget) {
                            this.$refs[widget.id][0][key] = widget[key];
                        }
                    }, 1);
                },
            },
        });

        Vue.component('widget-light', {
            template: '#widget-light',
            data() {
                return {
                    id: null,
                    type: 'widget-light',
                    x: null,
                    y: null,
                    range: null,
                    step: null,
                };
            },
        });

        Vue.component('widget-mouse', {
            template: '#widget-mouse',
            data() {
                return {
                    mouseX: null,
                    mouseY: null,
                };
            },
            methods: {
                update(mouseX, mouseY) {
                    this.mouseX = mouseX;
                    this.mouseY = mouseY;
                },
            },
        });

        this.ui = new Vue({
            el: '#ui',
        });
    }

    public preload(): void {
        this.load.image('tiles', './src/boilerplate/assets/Tileset_Large.png');
        this.load.tilemapTiledJSON(
            'Tile Layer 1',
            './src/boilerplate/tilemaps/test.json',
        );
        this.load.image('light', './src/boilerplate/assets/player.png');
    }

    public create(): void {
        this.map = this.add.tilemap('Tile Layer 1');
        this.tileset = this.map.addTilesetImage('test', 'tiles');
        this.backgroundLayer = this.map.createDynamicLayer(
            'Tile Layer 1',
            this.tileset,
            0,
            0,
        );
        this.entities.push(new Light({ scene: this }));
    }

    public update(): void {
        this.ui.$refs.rightSidebar.$refs.mouse[0].update(
            this.input.activePointer.worldX,
            this.input.activePointer.worldY,
        );
        // this.ui.$refs.rightSidebar.$refs.mouse[0].mouseX = this.input.activePointer.worldX;
        // this.ui.$refs.rightSidebar.$refs.mouse[0].mouseY = this.input.activePointer.worldY;

        for (const entity of this.entities) {
            entity.update();
        }
    }
}
