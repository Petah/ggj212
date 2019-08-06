import Vue from 'vue';
import WidgetList from './widgets/list.vue';
import { UiWidgetList } from './ui-widget-list';

export class Ui {
    private vue: Vue;
    public readonly rightSidebar: UiWidgetList;

    public constructor() {
        Vue.filter('round', (n: number, decimals: number = 0) => {
            if (decimals > 0) {
                const power = Math.pow(10, decimals);
                return Math.round(n * power) / power;
            }
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
