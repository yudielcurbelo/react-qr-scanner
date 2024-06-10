import React from 'react';

import TorchOn from '../assets/TorchOn';
import TorchOff from '../assets/TorchOff';

interface ITorchProps {
    scanning: boolean;
    status: boolean;
    torchToggle: (value: boolean) => void;
}

export default function Torch(props: ITorchProps) {
    const { status, scanning, torchToggle } = props;

    function toggleTorch(value: boolean) {
        torchToggle(value);
    }

    if (!scanning || !torchToggle) {
        return null;
    }

    return (
        <div style={{ bottom: 35, right: 3, position: 'absolute', zIndex: 2, cursor: 'pointer' }}>
            {status ? <TorchOff onClick={() => toggleTorch(false)} /> : <TorchOn onClick={() => toggleTorch(true)} />}
        </div>
    );
}
