import { useEffect, useState } from 'react';

import on from '../utilities/on';
import off from '../utilities/off';

const useMediaDevicesHook = () => {
    const [state, setState] = useState<InputDeviceInfo[]>([]);

    useEffect(() => {
        let mounted = true;

        const onChange = () => {
            navigator.mediaDevices
                .enumerateDevices()
                .then((devices) => {
                    if (mounted) {
                        setState(devices);
                    }
                })
                .catch((error) => console.log(error));
        };

        on(navigator.mediaDevices, 'devicechange', onChange);
        onChange();

        return () => {
            mounted = false;
            off(navigator.mediaDevices, 'devicechange', onChange);
        };
    }, []);

    return state;
};

const useMediaDevicesMock = () => {
    const devices: InputDeviceInfo[] = [];

    return devices;
};

export const useMediaDevices = typeof navigator !== 'undefined' && !!navigator.mediaDevices ? useMediaDevicesHook : useMediaDevicesMock;
