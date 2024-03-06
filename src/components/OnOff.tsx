import React from 'react';

import CameraOff from '../assets/CameraOff';
import CameraOn from '../assets/CameraOn';

interface ITorchProps {
    scanning: boolean;
    startScanning: (deviceId?: string | undefined) => void;
    stopScanning?: () => void;
}

export default function OnOff(props: ITorchProps) {
    const { scanning, startScanning, stopScanning } = props;

    function toggleScanning() {
        scanning ? stopScanning?.() : startScanning();
    }

    return <div style={{ bottom: 50, right: 3, position: 'absolute', zIndex: 2, cursor: 'pointer' }}>{scanning ? <CameraOff onClick={toggleScanning} /> : <CameraOn onClick={toggleScanning} />}</div>;
}
