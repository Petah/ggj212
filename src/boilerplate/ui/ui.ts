import WidgetLight from './widgets/light.vue';
import WidgetList from './widgets/list.vue';

export class Ui {
    private vue: Vue;

    public constructor() {
        this.vue = new Vue({
            el: '#ui',
            components: {
                WidgetLight,
                WidgetList,
            }
        });
    }

    public update(): void {
    }
}
