import { useState, useRef, useCallback, useEffect } from 'react';
import { shimGetUserMedia } from '../misc';
import { IStartCamera, IStartTaskResult, IStopTaskResult } from '../types';

type TaskResult = IStartTaskResult | IStopTaskResult;
type CreateObjectURLCompat = (obj: MediaSource | Blob | MediaStream) => string;

export default function useCamera() {
    const taskQueue = useRef<Promise<TaskResult>>(Promise.resolve({ type: 'stop', data: {} }));
    const currentStream = useRef<MediaStream | null>(null);
    const currentVideoTrack = useRef<MediaStreamTrack | null>(null);

    const [capabilities, setCapabilities] = useState<MediaTrackCapabilities>({});
    const [settings, setSettings] = useState<MediaTrackSettings>({});

    const runStartTask = useCallback(async (videoEl: HTMLVideoElement, constraints: MediaTrackConstraints): Promise<IStartTaskResult> => {
        if (!window.isSecureContext) {
            throw new Error('camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.');
        }

        if (navigator?.mediaDevices?.getUserMedia === undefined) {
            throw new Error('this browser has no Stream API support');
        }

        shimGetUserMedia();

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: constraints
        });

        if (videoEl.srcObject !== undefined) {
            videoEl.srcObject = stream;
        } else if (videoEl.mozSrcObject !== undefined) {
            videoEl.mozSrcObject = stream;
        } else if (window.URL.createObjectURL) {
            videoEl.src = (window.URL.createObjectURL as CreateObjectURLCompat)(stream);
        } else if (window.webkitURL) {
            videoEl.src = (window.webkitURL.createObjectURL as CreateObjectURLCompat)(stream);
        } else {
            videoEl.src = stream.id;
        }

        await Promise.race([
            videoEl.play(),

            new Promise((resolve) => setTimeout(resolve, 3000)).then(() => {
                throw new Error('Loading camera stream timed out after 3 seconds.');
            })
        ]);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const [track] = stream.getVideoTracks();

        setSettings(track.getSettings());
        setCapabilities(track.getCapabilities());

        currentStream.current = stream;
        currentVideoTrack.current = track;

        return {
            type: 'start',
            data: {
                videoEl,
                stream,
                constraints
            }
        };
    }, []);

    const runStopTask = useCallback(async (videoEl: HTMLVideoElement, stream: MediaStream): Promise<IStopTaskResult> => {
        videoEl.src = '';
        videoEl.srcObject = null;
        videoEl.load();

        for (const track of stream.getTracks()) {
            stream.removeTrack(track);
            track.stop();
        }

        currentStream.current = null;
        currentVideoTrack.current = null;

        setSettings({});

        return {
            type: 'stop',
            data: {}
        };
    }, []);

    const startCamera = useCallback(
        async (videoEl: HTMLVideoElement, { constraints, restart = false }: IStartCamera) => {
            taskQueue.current = taskQueue.current.then((prevTaskResult) => {
                if (prevTaskResult.type === 'start') {
                    const {
                        data: { videoEl: prevVideoEl, stream: prevStream, constraints: prevConstraints }
                    } = prevTaskResult;

                    if (!restart && videoEl === prevVideoEl && constraints === prevConstraints) {
                        return prevTaskResult;
                    }

                    return runStopTask(prevVideoEl, prevStream).then(() => runStartTask(videoEl, constraints));
                }

                return runStartTask(videoEl, constraints);
            });

            const taskResult = await taskQueue.current;

            if (taskResult.type === 'stop') {
                throw new Error('Something went wrong with the camera task queue (start task).');
            }
        },
        [runStartTask, runStopTask]
    );

    const stopCamera = useCallback(async () => {
        taskQueue.current = taskQueue.current.then((prevTaskResult) => {
            if (prevTaskResult.type === 'stop') {
                return prevTaskResult;
            }

            const {
                data: { videoEl, stream }
            } = prevTaskResult;

            return runStopTask(videoEl, stream);
        });

        const taskResult = await taskQueue.current;

        if (taskResult.type === 'start') {
            throw new Error('Something went wrong with the camera task queue (stop task).');
        }
    }, [runStopTask]);

    const updateConstraints = useCallback(async (newConstraints: MediaTrackConstraints) => {
        const videoTrack = currentVideoTrack.current;

        if (videoTrack) {
            // Mixing ImageCapture and non-ImageCapture constraints is not currently supported
            if (newConstraints.advanced && newConstraints.advanced[0].zoom) {
                const capabilities = videoTrack.getCapabilities();

                if (capabilities.torch) {
                    await videoTrack.applyConstraints({ advanced: [{ torch: false }] });
                }
            }

            await videoTrack.applyConstraints(newConstraints);

            const updatedCapabilities = videoTrack.getCapabilities();
            const updatedSettings = videoTrack.getSettings();

            setCapabilities(updatedCapabilities);
            setSettings(updatedSettings);
        } else {
            throw new Error('No active video track found.');
        }
    }, []);

    useEffect(() => {
        return () => {
            (async () => await stopCamera())();
        };
    }, [stopCamera]);

    return {
        capabilities,
        settings,
        startCamera,
        stopCamera,
        updateConstraints
    };
}
