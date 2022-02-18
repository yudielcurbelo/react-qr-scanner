import { BrowserQRCodeReader } from '@zxing/browser';
import { Result } from '@zxing/library';

export type OnResultFunction = (
    result: Result,
    codeReader: BrowserQRCodeReader
) => void;

export type OnErrorFunction = (
    error: Error,
    codeReader: BrowserQRCodeReader
) => void;