import { RefObject } from 'react';
import { type DetectedBarcode, type BarcodeFormat } from 'barcode-detector';
interface IUseScannerProps {
    videoElementRef: RefObject<HTMLVideoElement>;
    onScan: (result: DetectedBarcode[]) => void;
    onFound: (result: DetectedBarcode[]) => void;
    formats?: BarcodeFormat[];
    audio?: boolean;
    allowMultiple?: boolean;
    retryDelay?: number;
    scanDelay?: number;
}
export default function useScanner(props: IUseScannerProps): {
    startScanning: () => void;
    stopScanning: () => void;
};
export {};
//# sourceMappingURL=useScanner.d.ts.map