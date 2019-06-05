const DEBUG = false;

export function logDebug(...args: any) {
    if (DEBUG) {
        console.log.apply(console, args);
    }
}

export function logInfo(...args: any) {
    console.log.apply(console, args);
}
