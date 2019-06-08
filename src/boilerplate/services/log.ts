// tslint:disable:no-console
export const logSettings = {
    verbose: false,
    debug: false,
    info: true,
    error: true,
    sample: true,
};

export function logVerbose(...args: any) {
    if (logSettings.verbose) {
        console.log.apply(console, args);
    }
}

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

let sampleTimer = null;
export function logSample(...args: any) {
    if (logSettings.sample) {
        if (!sampleTimer) {
            sampleTimer = setTimeout(() => {
                console.log.apply(console, args);
                sampleTimer = null;
            }, 500);
        }
    }
}