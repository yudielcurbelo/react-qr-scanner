import React, { useState, useEffect } from 'react';

import TorchOn from '../assets/TorchOn';
import TorchOff from '../assets/TorchOff';

interface ITorchProps {
    enabled: boolean;
    switchTorch?: (value: boolean) => void;
}

export default function Torch(props: ITorchProps) {
    const { enabled, switchTorch } = props;

    const [torch, setTorch] = useState(false);

    useEffect(() => {
        if (!enabled) {
            setTorch(false);
        }
    }, [enabled]);

    function toggleTorch() {
        switchTorch?.(!torch);
        setTorch(!torch);
    }

    if (!enabled || switchTorch === undefined) {
        return null;
    }

    return <div style={{ bottom: 0, right: 3, position: 'absolute', zIndex: 2, cursor: 'pointer' }}>{torch ? <TorchOff onClick={toggleTorch} /> : <TorchOn onClick={toggleTorch} />}</div>;
}
