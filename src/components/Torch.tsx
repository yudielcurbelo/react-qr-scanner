import React, { useState, useEffect } from 'react';

import TorchOn from '../assets/TorchOn';
import TorchOff from '../assets/TorchOff';

interface ITorchProps {
    scanning: boolean;
    switchTorch?: (value: boolean) => void;
}

export default function Torch(props: ITorchProps) {
    const { scanning, switchTorch } = props;

    const [torch, setTorch] = useState(false);

    useEffect(() => {
        if (!scanning) {
            setTorch(false);
        }
    }, [scanning]);

    function toggleTorch() {
        switchTorch?.(!torch);
        setTorch(!torch);
    }

    if (!scanning || !switchTorch) {
        return null;
    }

    return <div style={{ bottom: 0, right: 3, position: 'absolute', zIndex: 2, cursor: 'pointer' }}>{torch ? <TorchOff onClick={toggleTorch} /> : <TorchOn onClick={toggleTorch} />}</div>;
}
