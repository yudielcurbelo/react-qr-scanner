import { useState, useEffect } from 'react';

export function useDevices() {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    async function getDevices() {
        return (await navigator.mediaDevices.enumerateDevices()).filter(({ kind }) => kind === 'videoinput');
    }

    useEffect(() => {
        (async () => {
            setDevices(await getDevices());
        })();
    }, []);

    return devices;
}
