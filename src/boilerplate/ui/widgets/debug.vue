<template id="widget-debug">
    <div>
        <div>mouseX: {{ mouseX }}</div>
        <div>mouseY: {{ mouseY }}</div>
        <div>debug: <input type="checkbox" v-model="scene.debugEnabled" /> {{ scene.debugEnabled }}</div>
        <div>collision: {{ collision ? 'true' : 'false' }}</div>
        <div>frame: {{ scene.frame }}</div>
        <div>
            timers:
            <div v-for="(timer, name) in scene.timers" :key="name">{{ name }}: {{ timer.time.toFixed(4) }}</div>
        </div>
    </div>
</template>

<script type="ts">
import { logSettings } from '../../services/debug';
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
    watch: {
        'scene.debugEnabled': function (value) {
            this.scene.storage.set('debug', value);
            logSettings.debug = value;
        },
    },
    methods: {
        updateMouse(mouseX, mouseY) {
            this.mouseX = mouseX;
            this.mouseY = mouseY;
        },
        updateCollision(collision) {
            this.collision = collision;
        }
    },
};
</script>

<style scoped>
</style>