import { ICommand } from "../../actors/commands/command";

export class Input {
    public turn: number = 0;
    public accelerate: number = 0;
    public break: number = 0;
    public shoot: number = 0;
    public commands: ICommand[] = [];
}
