import { IThrusterConfig } from './thruster-config-interface';

export const FatFlame: IThrusterConfig = {
    frame: 'red',
    lifespan: 2000,
    speed: { min: 400, max: 600 },
    angle: 330,
    scale: { start: 0.4, end: 0 },
    quantity: 2,
};
