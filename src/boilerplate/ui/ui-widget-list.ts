export interface IWidget {
    id: string;
    type: string;
}

export class UiWidgetList {
    constructor(
        private widgetList: Vue.Component,
    ) {

    }

    public addWidget<T extends IWidget>(widget: T): T {
        this.widgetList.addWidget(widget);
        return new Proxy<any>(this, {
            get: (target, name) => {
                return (...args: any[]) => {
                    setTimeout(() => {
                        target.widgetList.$refs[widget.id][0][name](...args);
                    }, 1);
                };
            },
            set: (target, name, value) => {
                target.widgetList.$refs[widget.id][0][name] = value;
                return true;
            },
        });
    }
}
