import { logError } from './debug';

export class LocalStorage {
    private localStoragePrefix = 'phaser';

    public set(key: string, value: any) {
        if (value === undefined) {
            value = null;
        }
        localStorage.setItem(this.getKey(key), JSON.stringify(value));
    }

    public get<T>(key: string, defaultValue: T): T {
        const storageKey = this.getKey(key);
        try {
            const item = localStorage.getItem(storageKey);
            if (item === undefined) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (e) {
            logError('Failed to parse storage item', storageKey);
            logError(e);
            localStorage.removeItem(storageKey);
        }
        return defaultValue;
    }

    public remove(key: string) {
        localStorage.removeItem(this.getKey(key));
    }

    private getKey(key: string) {
        return this.localStoragePrefix + '_' + key;
    }
}
