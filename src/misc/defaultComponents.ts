import { outline } from './overlays';

import { IScannerComponents } from '../types';

export const defaultComponents: IScannerComponents = {
    audio: true,
    tracker: outline,
    onOff: false,
    finder: true,
    torch: true
};
