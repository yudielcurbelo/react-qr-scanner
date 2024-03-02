import React, { useState } from 'react';

import CameraOff from '../assets/CameraOff';
import CameraOn from '../assets/CameraOn';

interface ITorchProps {
    enabled: boolean;
    startScanning: (deviceId?: string | undefined) => void;
    stopScanning?: () => void;
}

export default function OnOff(props: ITorchProps) {
    const { enabled, startScanning, stopScanning } = props;

    const [scanning, setScanning] = useState(enabled);

    function toggleScanning() {
        scanning ? stopScanning?.() : startScanning();
        setScanning((prevState) => !prevState);
    }

    return <div style={{ bottom: 50, right: 3, position: 'absolute', zIndex: 2, cursor: 'pointer' }}>{scanning ? <CameraOff onClick={toggleScanning} /> : <CameraOn onClick={toggleScanning} />}</div>;
}
