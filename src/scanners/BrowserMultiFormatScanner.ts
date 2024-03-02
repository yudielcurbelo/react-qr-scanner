import { MultiFormatReader } from '@zxing/library';

import { BrowserScanner } from './BrowserScanner';
import { IBrowserScannerOptions } from '../types';
import { defaultOptions } from '../misc';

export class BrowserMultiFormatScanner extends BrowserScanner {
    protected readonly reader: MultiFormatReader;

    public constructor(options?: IBrowserScannerOptions) {
        const reader = new MultiFormatReader();

        reader.setHints(options?.hints);

        super(reader, { ...defaultOptions, ...options });

        this.reader = reader;
    }
}
