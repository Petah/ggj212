export interface ControllerInput {
    xAxis: number;
    yAxis: number;
}

export interface Controller {
    getInput(): ControllerInput;
}
