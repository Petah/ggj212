<template id="widget-debug">
    <div>
        <div>mouse: {{ mouseX | int }} {{ mouseY | int }}</div>
        <div>camera: {{ scene.cameras ? scene.cameras.main.scrollX : NaN }} {{ scene.cameras ? scene.cameras.main.scrollY : NaN }}</div>
        <div>paused: <input type="checkbox" v-model="scene.paused" /> {{ scene.paused }}</div>
        <div>debug: <input type="checkbox" v-model="scene.debugEnabled" /> {{ scene.debugEnabled }}</div>
        <div>frame: {{ scene.frame }}</div>
        <div>
            timers:
            <div v-for="(timer, name) in scene.timers" :key="name">{{ name }}: {{ timer.average.toFixed(6) }}</div>
        </div>
    </div>
</template>

<script type="ts">
import { logSettings } from '../../services/log';
export default {
    name: 'WidgetDebug',
    data() {
        return {
            mouseX: null,
            mouseY: null,
            scene: {},
            collision: false,
        };
    },
    filters: {
        int: (n) => {
            return Math.round(n);
        },
    },
    watch: {
        'scene.debugEnabled': function (value) {
            this.scene.storage.set('debug', value);
            logSettings.debug = value;
            if (this.scene.debug) {
                this.scene.debug.clear();
            }
        },
    },
    methods: {
        updateMouse(mouseX, mouseY) {
            this.mouseX = mouseX;
            this.mouseY = mouseY;
        },
    },
};
</script>

<style scoped>
</style>