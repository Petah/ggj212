<template id="widget-mouse">
    <div>
        <div>mouseX: {{ mouseX }}</div>
        <div>mouseY: {{ mouseY }}</div>
    </div>
</template>

<script type="ts">
export default {
    name: 'WidgetMouse',
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
};
</script>

<style scoped>
</style>