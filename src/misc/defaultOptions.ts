import { IBrowserScannerOptions } from '../types';
import { defaultConstraints } from './defaultConstraints';

export const defaultOptions: IBrowserScannerOptions = {
    deviceId: undefined,
    hints: undefined,
    constraints: defaultConstraints,
    delayBetweenScanAttempts: 500,
    delayBetweenScanSuccess: 500,
    tryPlayVideoTimeout: 10000
};
