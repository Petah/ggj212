import Vue from 'vue';
import WidgetList from './widgets/list.vue';
import { UiWidgetList } from './ui-widget-list';

export class Ui {
    private vue: Vue;
    public readonly rightSidebar: UiWidgetList;

    public constructor() {
        Vue.filter('round', (n: number) => {
            return Math.round(n);
        });

        this.vue = new Vue({
            el: '#ui',
            components: {
                WidgetList,
            },
        });
        this.rightSidebar = new UiWidgetList(this.vue.$refs.rightSidebar);
    }
}
