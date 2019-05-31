<template>
    <div>
        <div>x: {{ x }}</div>
        <div>y: {{ y }}</div>
        <div>range: {{ range }}</div>
        <input type="range" min="0" max="100" step="1" v-model="range">
        <input type="number" v-model="range">
        <div>step: {{ step }}</div>
        <input type="range" min="0.1" max="2" step="0.1" v-model="step">
        <input type="number" v-model="step">
    </div>
</template>

<script>
export default {
    template: 'WidgetLight',
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
};
</script>

<style scoped>
</style>