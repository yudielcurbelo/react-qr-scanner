import React, { useState, useEffect } from 'react';

import TorchOn from '../assets/TorchOn';
import TorchOff from '../assets/TorchOff';

interface ITorchProps {
    torch: boolean;
    scanning: boolean;
    torchToggle: (value: boolean) => void;
}

export default function Torch(props: ITorchProps) {
    const { torch, scanning, torchToggle } = props;

    // const [torch, setTorch] = useState(false);

    // useEffect(() => {
    //     if (!scanning) {
    //         setTorch(false);
    //     }
    // }, [scanning]);

    function toggleTorch(value: boolean) {
        // setTorch(value);
        torchToggle(value);
    }

    if (!scanning || !torchToggle) {
        return null;
    }

    return (
        <div style={{ top: 335, right: 3, position: 'absolute', zIndex: 2, cursor: 'pointer' }}>
            {torch ? <TorchOff onClick={() => toggleTorch(false)} /> : <TorchOn onClick={() => toggleTorch(true)} />}
        </div>
    );
}
