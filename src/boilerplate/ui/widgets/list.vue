<template>
    <div>
        <component
            v-for="widget in widgets"
            :is="widget.name"
            :widget="widget"
            :key="widget.name"
            :ref="widget.name"
        ></component>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { IWidget } from '../widget-interface';

@Component({
})
export default class WidgetList extends Vue {
    widgets: IWidget[] = [];
    addWidget(widget: IWidget, options: object) {
        if (!this.$options.components[widget.name]) {
            this.$options.components[widget.name] = widget;
        }
        this.widgets.push(widget);
        setTimeout(() => {
            for (const key in widget) {
                this.$refs[widget.name][0][key] = widget[key];
            }
            if (this.$refs[widget.name][0].ready) {
                this.$refs[widget.name][0].ready(options);
            }
        }, 1);
    }
};
</script>

<style scoped>
</style>