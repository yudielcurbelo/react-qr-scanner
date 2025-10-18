import { useCallback, useEffect, useState } from 'react';

export function useDevices() {
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

	const getDevices = useCallback(async () => {
		const devices = await navigator.mediaDevices.enumerateDevices();
		return devices.filter((d) => d.kind === 'videoinput');
	}, []);

	useEffect(() => {
		(async () => {
			setDevices(await getDevices());
		})();
	}, [getDevices]);

	return devices;
}
