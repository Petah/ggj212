export default class Path {
    static asset(path: string): string {
        return `./src/boilerplate/assets/${path}`;
    }

    static base(path: string): string {
        return `./src/boilerplate/${path}`;
    }
}
