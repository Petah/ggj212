import { IScene } from './scene-interface';

export const preloadCallbacks: Array<(scene: IScene) => void> = [];

export function preload(callback: (scene: IScene) => void) {
    preloadCallbacks.push(callback);
}
