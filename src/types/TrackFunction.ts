import { IDetectedBarcode } from './index';

type TrackFunction = (detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) => void;

export default TrackFunction;
