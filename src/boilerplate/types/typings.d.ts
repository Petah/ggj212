import * as math from "mathjs";

declare class Vue {
    constructor(params: any);
}

declare global {
    var math: typeof math;
}
