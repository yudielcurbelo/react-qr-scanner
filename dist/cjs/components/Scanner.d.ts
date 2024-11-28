import React, { ReactNode } from 'react';
import type { BarcodeFormat } from 'barcode-detector';
import { IDetectedBarcode, IScannerClassNames, IScannerComponents, IScannerStyles } from '../types';
export interface IScannerProps {
    onScan: (detectedCodes: IDetectedBarcode[]) => void;
    onError?: (error: unknown) => void;
    constraints?: MediaTrackConstraints;
    formats?: BarcodeFormat[];
    paused?: boolean;
    children?: ReactNode;
    components?: IScannerComponents;
    styles?: IScannerStyles;
    classNames?: IScannerClassNames;
    allowMultiple?: boolean;
    scanDelay?: number;
}
export declare function Scanner(props: IScannerProps): React.JSX.Element;
//# sourceMappingURL=Scanner.d.ts.map