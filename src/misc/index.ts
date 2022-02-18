export class InsecureContextError extends Error {
    constructor() {
        super('Camera access is only permitted in secure context. Use HTTPS or localhost.');
        this.name = 'InsecureContextError';
    }
}

export class StreamApiNotSupportedError extends Error {
    constructor() {
        super('This browser has no support for Stream API.');
        this.name = 'StreamApiNotSupportedError';
    }
}

export const isStreamApiSupported = (): void => {
    if (!window.isSecureContext) {
        throw new InsecureContextError();
    }

    if (navigator?.mediaDevices?.getUserMedia === undefined) {
        throw new StreamApiNotSupportedError();
    }
};