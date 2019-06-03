import Entity from '../objects/entity';

export class EntityManager {
    private entities: Entity[] = [];

    public constructor() {
    }

    public add(entity: Entity) {
        this.entities.push(entity);
    }
}
