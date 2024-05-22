import React from 'react';

import TorchOn from '../assets/TorchOn';
import TorchOff from '../assets/TorchOff';

interface ITorchProps {
    torch: boolean;
    scanning: boolean;
    torchToggle: (value: boolean) => void;
}

export default function Torch(props: ITorchProps) {
    const { torch, scanning, torchToggle } = props;

    function toggleTorch(value: boolean) {
        torchToggle(value);
    }

    if (!scanning || !torchToggle) {
        return null;
    }

    return (
        <div style={{ bottom: 35, right: 3, position: 'absolute', zIndex: 2, cursor: 'pointer' }}>
            {torch ? <TorchOff onClick={() => toggleTorch(false)} /> : <TorchOn onClick={() => toggleTorch(true)} />}
        </div>
    );
}
