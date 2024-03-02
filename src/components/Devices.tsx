import React, { useEffect, useState } from 'react';

import { BrowserScanner } from '../scanners/BrowserScanner';

interface IDevicesProps {
    onChange?: (deviceId: string) => void;
}

export default function Devices(props: IDevicesProps) {
    const { onChange } = props;

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    async function getDevices() {
        const devices = (await BrowserScanner.listVideoInputDevices()) || [];
        const hasDevices = devices && devices.length > 0;

        if (!hasDevices) {
            console.warn('No video input devices found');
        }

        return devices;
    }

    useEffect(() => {
        (async () => {
            setDevices(await getDevices());
        })();
    }, []);

    return (
        <select onChange={(e) => onChange?.(e.target.value)}>
            <option value="">Select a device</option>
            {devices.map((device, index) => (
                <option key={index} value={device.deviceId}>
                    {device.label}
                </option>
            ))}
        </select>
    );
}
