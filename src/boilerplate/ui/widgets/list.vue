<template>
    <div>
        <component
            v-for="widget in widgets"
            :is="widget.type"
            :widget="widget"
            :key="widget.id"
            :ref="widget.id"
        ></component>
    </div>
</template>

<script type="ts">
import WidgetDebug from './debug.vue';

export default {
    name: 'WidgetList',
    components: {
        WidgetDebug,
    },
    data() {
        return {
            widgets: [],
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
};
</script>

<style scoped>
</style>