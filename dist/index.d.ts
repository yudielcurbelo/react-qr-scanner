import React, { CSSProperties, ReactNode } from 'react';
import { BarcodeFormat } from 'barcode-detector';
export { setZXingModuleOverrides } from 'barcode-detector';

interface IScannerComponents {
    tracker?: TrackFunction;
    audio?: boolean;
    onOff?: boolean;
    finder?: boolean;
    torch?: boolean;
    zoom?: boolean;
}

interface IPoint {
    x: number;
    y: number;
}

interface IBoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IUseScannerState {
    lastScan: number;
    lastOnScan: number;
    contentBefore: string[];
    lastScanHadContent: boolean;
}

interface IDetectedBarcode {
    boundingBox: IBoundingBox;
    cornerPoints: IPoint[];
    format: string;
    rawValue: string;
}

interface IStartTaskResult {
    type: 'start';
    data: {
        videoEl: HTMLVideoElement;
        stream: MediaStream;
        constraints: MediaTrackConstraints;
    };
}

interface IStopTaskResult {
    type: 'stop';
    data: {};
}

interface IStartCamera {
    constraints: MediaTrackConstraints;
    restart?: boolean;
}

interface IScannerStyles {
    container?: CSSProperties;
    video?: CSSProperties;
    finderBorder?: number;
}

interface IScannerClassNames {
    container?: string;
    video?: string;
}

type TrackFunction = (detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) => void;

interface IScannerProps {
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
declare function Scanner(props: IScannerProps): React.JSX.Element;

declare function useDevices(): MediaDeviceInfo[];

declare function outline(detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D): void;
declare function boundingBox(detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D): void;
declare function centerText(detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D): void;

export { type IBoundingBox, type IDetectedBarcode, type IPoint, type IScannerClassNames, type IScannerComponents, type IScannerProps, type IScannerStyles, type IStartCamera, type IStartTaskResult, type IStopTaskResult, type IUseScannerState, Scanner, type TrackFunction, boundingBox, centerText, outline, useDevices };
