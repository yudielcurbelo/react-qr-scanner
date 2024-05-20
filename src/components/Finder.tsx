import React from 'react';

import OnOff from './OnOff';
import Torch from './Torch';

interface IFinderProps {
    scanning: boolean;
    loading: boolean;
    capabilities: MediaTrackCapabilities;
    border?: number;
    onOff?: boolean;
    startScanning: (deviceId?: string | undefined) => void;
    stopScanning: () => void;
    torch: {
        toggle?: (value: boolean) => void;
        status?: boolean;
    };
}

export default function Finder(props: IFinderProps) {
    const { scanning, loading, capabilities, border = 35, onOff, torch, startScanning, stopScanning } = props;

    const color = 'rgba(255, 0, 0, 0.5)';
    const stokeWidth = 3;

    return (
        <div>
            {onOff && <OnOff scanning={scanning} startScanning={startScanning} stopScanning={stopScanning} />}
            {torch.toggle && capabilities.torch && <Torch torch={torch.status ?? false} scanning={scanning} torchToggle={torch.toggle} />}
            <svg
                viewBox="0 0 100 100"
                style={{
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    boxSizing: 'border-box',
                    border: `${border >= 35 ? border : 35}px solid rgba(0, 0, 0, 0.2)`
                }}
            >
                {loading && (
                    <text x="50" y="50" textAnchor="middle" fill="black" fontSize="8" fontFamily="Arial" fontWeight="bold">
                        Loading ...
                        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                    </text>
                )}
                <path fill="none" d="M23,0 L0,0 L0,23" stroke={color} strokeWidth={stokeWidth} />
                <path fill="none" d="M0,77 L0,100 L23,100" stroke={color} strokeWidth={stokeWidth} />
                <path fill="none" d="M77,100 L100,100 L100,77" stroke={color} strokeWidth={stokeWidth} />
                <path fill="none" d="M100,23 L100,0 77,0" stroke={color} strokeWidth={stokeWidth} />
            </svg>
        </div>
    );
}
