import React from 'react';
interface IFinderProps {
    scanning: boolean;
    loading: boolean;
    capabilities: MediaTrackCapabilities;
    border?: number;
    onOff?: boolean;
    startScanning: (deviceId?: string | undefined) => void;
    stopScanning: () => void;
    torch?: {
        status: boolean;
        toggle: (value: boolean) => void;
    };
    zoom?: {
        value: number;
        onChange: (value: number) => void;
    };
}
export default function Finder(props: IFinderProps): React.JSX.Element;
export {};
//# sourceMappingURL=Finder.d.ts.map