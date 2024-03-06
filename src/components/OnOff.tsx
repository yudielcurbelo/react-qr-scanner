import React, { useState } from 'react';

import CameraOff from '../assets/CameraOff';
import CameraOn from '../assets/CameraOn';

interface ITorchProps {
    scanning: boolean;
    startScanning: (deviceId?: string | undefined) => void;
    stopScanning?: () => void;
}

export default function OnOff(props: ITorchProps) {
    const { scanning, startScanning, stopScanning } = props;

    const [buttonDisabled, setButtonDisabled] = useState(false);

    function toggleScanning() {
        setButtonDisabled(true);

        scanning ? stopScanning?.() : startScanning();

        setTimeout(() => setButtonDisabled(false), 3000);
    }

    return (
        <div
            style={{
                bottom: 50,
                right: 3,
                position: 'absolute',
                zIndex: 2,
                cursor: buttonDisabled ? 'default' : 'pointer'
            }}
        >
            {scanning ? <CameraOff disabled={buttonDisabled} onClick={toggleScanning} /> : <CameraOn disabled={buttonDisabled} onClick={toggleScanning} />}
        </div>
    );
}
