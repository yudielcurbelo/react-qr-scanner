import type { IDetectedBarcode } from './index';

export type TrackFunction = (
	detectedCodes: IDetectedBarcode[],
	ctx: CanvasRenderingContext2D,
) => void;
