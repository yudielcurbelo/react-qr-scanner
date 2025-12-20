import type { TrackFunction } from './index';

export interface IScannerComponents {
	finder?: boolean;
	torch?: boolean;
	tracker?: TrackFunction;
	onOff?: boolean;
	zoom?: boolean;
	audio?: boolean;
}
