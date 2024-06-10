import { TrackFunction } from './index';

export interface IScannerComponents {
    tracker?: TrackFunction;
    audio?: boolean;
    onOff?: boolean;
    finder?: boolean;
    torch?: boolean;
    zoom?: boolean;
}
