<template id="widget-debug">
    <div v-if="ship" class="card">
        <div class="card-header">ship:</div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">
                <div>x: {{ ship.x | round }}</div>
                <div>y: {{ ship.y | round }}</div>
            </li>
            <li class="list-group-item">
                <div>move:</div>
                <div>acceleration: {{ ship.moveSpeed.acceleration }}</div>
                <div>friction: {{ ship.moveSpeed.friction }}</div>
                <div>direction: {{ ship.moveSpeed.direction | round }}</div>
                <div>
                    speed:
                    {{ -ship.moveSpeed.min }}
                    <input type="range" :min="ship.moveSpeed.min" :max="ship.moveSpeed.max" step="0.01" disabled :value="ship.moveSpeed.speed" />
                    {{ ship.moveSpeed.max }}
                </div>
            </li>
            <li class="list-group-item">
                <div>turn:</div>
                <div>acceleration: {{ ship.turnSpeed.acceleration }}</div>
                <div>friction: {{ ship.turnSpeed.friction }}</div>
                <div>direction: {{ ship.turnSpeed.direction | round }}</div>
                <div>
                    speed:
                    {{ -ship.turnSpeed.maxTurnSpeed }}
                    <input type="range" :min="-ship.turnSpeed.maxTurnSpeed" :max="ship.turnSpeed.maxTurnSpeed" step="0.01" disabled :value="ship.turnSpeed.currentTurnSpeed" />
                    {{ ship.turnSpeed.maxTurnSpeed }}
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ship } from '../../objects/actors/ship';

@Component({
})
export default class WidgetShip extends Vue {
    public ship: Ship | null = null;
}
</script>

<style scoped>
</style>