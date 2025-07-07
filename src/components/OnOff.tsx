import React, { useState } from 'react';

import CameraOffIcon from '../assets/CameraOffIcon';
import CameraOnIcon from '../assets/CameraOnIcon';

interface IOnOffProps {
    scanning: boolean;
    startScanning: (deviceId?: string | undefined) => void;
    stopScanning: () => void;
    style?: React.CSSProperties;
}

export default function OnOff(props: IOnOffProps) {
    const { scanning, style, startScanning, stopScanning } = props;

    const [buttonDisabled, setButtonDisabled] = useState(false);

    function toggleScanning() {
        setButtonDisabled(true);

        scanning ? stopScanning() : startScanning();

        setTimeout(() => setButtonDisabled(false), 1000);
    }

    return (
        <div
            style={{
                bottom: 85,
                right: 8,
                position: 'absolute',
                zIndex: 2,
                cursor: buttonDisabled ? 'default' : 'pointer'
            }}
        >
            {scanning ? <CameraOffIcon disabled={buttonDisabled} onClick={toggleScanning} style={style} /> : <CameraOnIcon disabled={buttonDisabled} onClick={toggleScanning} style={style} />}
        </div>
    );
}
