import { useEffect, useState } from 'react';

import { BrowserScanner } from '../scanners/BrowserScanner';

export function useDeviceList() {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    async function getDevices() {
        const devices = (await BrowserScanner.listVideoInputDevices(true)) || [];
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

    return devices;
}
