<template id="widget-debug">
    <div class="card">
        <div class="card-header">debug:</div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">
                <div>mouse: {{ mouseX | round }} {{ mouseY | round }}</div>
                <div v-if="scene && scene.cameras">camera: {{ scene.cameras.main.worldView.x | round }} {{ scene.cameras.main.worldView.y | round }} {{ scene.cameras.main.worldView.width | round }} {{ scene.cameras.main.worldView.height | round }}</div>
                <div v-if="scene && scene.cameras">zoom: {{ scene.cameras.main.zoom | round(4) }}</div>
                <div v-if="scene">paused: <input type="checkbox" v-model="scene.paused" /> {{ scene.paused }}</div>
                <div v-if="scene">debug: <input type="checkbox" v-model="scene.debugEnabled" /> {{ scene.debugEnabled }}</div>
                <div v-if="scene">updates: {{ scene.updates }}</div>
                <div v-if="scene">ups: {{ scene.updatesPerSecond }}</div>
                <div v-if="scene">entities: {{ scene.entities | objectSize }}</div>
                <div v-if="scene">collidables: {{ scene.collidables | objectSize }}</div>
            </li>
            <li class="list-group-item">
                <div v-if="scene">
                    timers:
                    <div v-for="(timer, name) in scene.timers" :key="name">{{ name }}: {{ timer.average.toFixed(6) }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { logSettings } from '../../services/log';
import Vue from 'vue';
import Component from 'vue-class-component';
import { IScene } from '../../scenes/scene-interface';

interface IWidgetDebugInit {
    scene: IScene;
}

@Component({
    // watch: {
    //     'scene.debugEnabled': function (value) {
    //         this.scene.storage.set('debug', value);
    //         logSettings.debug = value;
    //         if (this.scene.debug) {
    //             this.scene.debug.clear();
    //         }
    //     },
    // },
})
export default class WidgetDebug extends Vue {
    public mouseX: number = 0;
    public mouseY: number = 0;
    public collision = false;
    public scene: IScene | null = null;

    public ready({ scene }: IWidgetDebugInit) {
        this.scene = scene;
    }

    public updateMouse(mouseX: number, mouseY: number) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }
};
</script>

<style scoped>
</style>