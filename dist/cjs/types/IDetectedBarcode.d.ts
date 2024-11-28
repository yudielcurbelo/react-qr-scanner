import { IBoundingBox, IPoint } from './index';
export interface IDetectedBarcode {
    boundingBox: IBoundingBox;
    cornerPoints: IPoint[];
    format: string;
    rawValue: string;
}
//# sourceMappingURL=IDetectedBarcode.d.ts.map