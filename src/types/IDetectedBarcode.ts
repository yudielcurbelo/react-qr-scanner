import { IBoundingBox, IPoint } from './index';

export default interface IDetectedBarcode {
    boundingBox: IBoundingBox;
    cornerPoints: IPoint[];
    format: string;
    rawValue: string;
}
