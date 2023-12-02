import { useEffect, useState } from 'react';

import on from '../utilities/on';
import off from '../utilities/off';

import { defaultConstraints } from '../misc/defaultConstraints';

const useMediaDevicesHook = (constraints?: MediaTrackConstraints) => {
    const [state, setState] = useState<MediaTrackSettings[]>([]);

    useEffect(() => {
        let mounted = true;
        let mediaStream: MediaStream;

        let newConstraints: MediaStreamConstraints = {
            audio: false,
            video: constraints ?? defaultConstraints
        };

        const onChange = () => {
            navigator.mediaDevices
                .getUserMedia(newConstraints)
                .then((stream) => {
                    let settings: Array<MediaTrackSettings> = [];
                    mediaStream = stream;
                    stream.getVideoTracks().forEach((track) => {
                        settings.push(track.getSettings());
                    });

                    setState(settings);
                })
                .catch((error) => console.log(error));
        };

        on(navigator.mediaDevices, 'devicechange', onChange);
        onChange();

        return () => {
            mounted = false;
            off(navigator.mediaDevices, 'devicechange', onChange);

            if(typeof mediaStream !== 'undefined') {
                mediaStream.getVideoTracks().forEach((track) => {
                    track.stop()
                });
            }
        };
    }, []);

    return state;
};

const useMediaDevicesMock = () => {
    const devices: MediaTrackSettings[] = [];

    return devices;
};

export const useMediaDevices = typeof navigator !== 'undefined' && !!navigator.mediaDevices ? useMediaDevicesHook : useMediaDevicesMock;
