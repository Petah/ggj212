export interface IThrusterConfig {
    frame: string;
    lifespan: number;
    angle: number;
    quantity: number;
    speed: {
        min: number,
        max: number,
    };
    scale: {
        start: number,
        end: number,
    };
}
