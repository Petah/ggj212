export interface ICollidable {
    speed: number;
    getPosition(): {x: number, y: number};
    getCollisionPolygons(): Array<Array<{x: number, y: number}>>;
}
