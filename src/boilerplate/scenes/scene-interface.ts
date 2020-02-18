import { EventGroup } from './event-group';
import { Debug } from '../objects/debug-draw';
import { Entity } from '../objects/actors/entity';

export interface IScene extends Phaser.Scene {
    addEntity(entity: Entity): number;
    destroyEntity(entity: Entity): void;
}
