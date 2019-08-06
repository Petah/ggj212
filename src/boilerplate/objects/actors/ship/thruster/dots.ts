import { IThrusterConfig } from './thruster-config-interface';

export const Dots: IThrusterConfig = {
    frame: 'blue',
    lifespan: 2000,
    speed: { min: 10, max: 20 },
    angle: 330,
    scale: { start: 0.1, end: 0 },
    quantity: 1,
};
