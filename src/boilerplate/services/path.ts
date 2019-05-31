export default class Path {
    public static asset(path: string): string {
        return `./src/boilerplate/assets/${path}`;
    }

    public static base(path: string): string {
        return `./src/boilerplate/${path}`;
    }
}
