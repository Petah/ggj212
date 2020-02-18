import { Input } from "../../player/controller/input";
import { Entity } from "../entity";
import { Debug } from "../../debug-draw";

export interface ICommand {
    processInput(input: Input, entity: Entity): void;
    onDebug(debug: Debug): void;
}
