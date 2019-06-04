export type ControllerInput = {
    xAxis: number;
    yAxis: number;
};

export interface Controller {
    getInput(): ControllerInput;
}
