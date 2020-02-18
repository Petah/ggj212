import { IWidget } from './widget-interface';

export class UiWidgetList {
    constructor(
        private widgetList: Vue.Component,
    ) {

    }

    public addWidget<T extends IWidget>(widget: T, options: object = {}): T {
        this.widgetList.addWidget(widget, options);
        return new Proxy<any>(this, {
            get: (target, name) => {
                return (...args: any[]) => {
                    setTimeout(() => {
                        target.widgetList.$refs[widget.name][0][name](...args);
                    }, 1);
                };
            },
            set: (target, name, value) => {
                target.widgetList.$refs[widget.name][0][name] = value;
                return true;
            },
        });
    }
}
