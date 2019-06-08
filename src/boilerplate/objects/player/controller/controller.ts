export interface IControllerInput {
    xAxis: number;
    yAxis: number;
}

export interface IController {
    getInput(): IControllerInput;
}
