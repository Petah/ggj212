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

<script>
export default {
    name: 'WidgetList',
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
};
</script>

<style scoped>
</style>