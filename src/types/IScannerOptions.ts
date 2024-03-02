import { DecodeHintType } from '@zxing/library';

interface IScannerOptions {
    deviceId?: string;
    hints?: Map<DecodeHintType, any>;
    constraints?: MediaTrackConstraints;
    delayBetweenScanSuccess?: number;
    delayBetweenScanAttempts?: number;
    tryPlayVideoTimeout?: number;
}

export default IScannerOptions;
