import WidgetLight from './widgets/light.vue';
import WidgetList from './widgets/list.vue';
import WidgetDebug from './widgets/debug.vue';
import { UiWidgetList } from './ui-widget-list';


export class Ui {
    private vue: Vue;
    public readonly rightSidebar: UiWidgetList;

    public constructor() {
        this.vue = new Vue({
            el: '#ui',
            components: {
                WidgetLight,
                WidgetList,
                WidgetDebug,
            },
        }) as Vue.VueConstructor;
        this.rightSidebar = new UiWidgetList(this.vue.$refs.rightSidebar);
    }
}
