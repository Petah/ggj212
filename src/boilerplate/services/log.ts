export const logSettings = {
    debug: false,
    info: true,
    error: true,
};

export function logDebug(...args: any) {
    if (logSettings.debug) {
        console.log.apply(console, args);
    }
}

export function logInfo(...args: any) {
    if (logSettings.info) {
        console.log.apply(console, args);
    }
}

export function logError(...args: any) {
    if (logSettings.error) {
        console.error.apply(console, args);
    }
}
