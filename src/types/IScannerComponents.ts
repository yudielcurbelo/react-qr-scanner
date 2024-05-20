import { TrackFunction } from './index';

interface IScannerComponents {
    tracker?: TrackFunction;
    audio?: boolean;
    onOff?: boolean;
    finder?: boolean;
    torch?: boolean;
}

export default IScannerComponents;
