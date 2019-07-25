import { Input } from './input';

export interface IController {
    processInput(input: Input): void;
}
