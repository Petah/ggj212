declare type Widget = {
    id: string;
    type: string;
};

export class UiWidgetList {
    constructor(
        private widgetList: Vue.Component,
    ) {

    }

    addWidget<T>(widget: T): T {
        this.widgetList.addWidget(widget);
        return new Proxy(this, {
            get: (target, name) => {
                return (...args: any[]) => {
                    setTimeout(() => {
                        target.widgetList.$refs[widget.id][0][name](...args);
                    }, 1);
                }
            },
        });
    }
}
