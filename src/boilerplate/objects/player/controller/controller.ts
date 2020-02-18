import { Input } from './input';
import { Entity } from '../../actors/entity';

export const TURN_LEFT = -1;
export const TURN_RIGHT = 1;
export const TURN_STOP = 0;

export interface IController {
    processInput(input: Input, entity: Entity): void;
}
