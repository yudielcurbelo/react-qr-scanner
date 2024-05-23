import { useState, useRef, useCallback, useEffect } from 'react';

import { shimGetUserMedia } from '../misc';
import { IStartCamera, IStartTaskResult, IStopTaskResult } from '../types';

type TaskResult = IStartTaskResult | IStopTaskResult;
type CreateObjectURLCompat = (obj: MediaSource | Blob | MediaStream) => string;

export default function useCamera() {
    const taskQueue = useRef<Promise<TaskResult>>(Promise.resolve({ type: 'stop', data: {} }));

    const [capabilities, setCapabilities] = useState<MediaTrackCapabilities>({});
    const [torch, setTorch] = useState<boolean>(false);

    const runStartTask = useCallback(async (videoEl: HTMLVideoElement, constraints: MediaTrackConstraints, torch: boolean): Promise<IStartTaskResult> => {
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
        const trackCapabilities: Partial<MediaTrackCapabilities> = track?.getCapabilities?.() ?? {};

        let isTorchOn = false;

        if (torch && trackCapabilities.torch) {
            await track.applyConstraints({ advanced: [{ torch: true }] });
            isTorchOn = true;
        }

        return {
            type: 'start',
            data: {
                videoEl,
                stream,
                capabilities: trackCapabilities,
                constraints,
                isTorchOn
            }
        };
    }, []);

    const runStopTask = useCallback(async (videoEl: HTMLVideoElement, stream: MediaStream, isTorchOn: boolean): Promise<IStopTaskResult> => {
        videoEl.src = '';
        videoEl.srcObject = null;
        videoEl.load();

        for (const track of stream.getTracks()) {
            if (isTorchOn) {
                await track.applyConstraints({ advanced: [{ torch: false }] });
            }

            stream.removeTrack(track);
            track.stop();
        }

        return {
            type: 'stop',
            data: {}
        };
    }, []);

    const startCamera = useCallback(
        async (videoEl: HTMLVideoElement, { constraints, torch, restart = false }: IStartCamera): Promise<Partial<MediaTrackCapabilities>> => {
            taskQueue.current = taskQueue.current.then((prevTaskResult) => {
                if (prevTaskResult.type === 'start') {
                    const {
                        data: { videoEl: prevVideoEl, stream: prevStream, constraints: prevConstraints, isTorchOn: prevIsTorchOn }
                    } = prevTaskResult;

                    if (!restart && videoEl === prevVideoEl && constraints === prevConstraints && torch === prevIsTorchOn) {
                        return prevTaskResult;
                    }

                    return runStopTask(prevVideoEl, prevStream, prevIsTorchOn).then(() => runStartTask(videoEl, constraints, torch));
                }

                return runStartTask(videoEl, constraints, torch);
            });

            const taskResult = await taskQueue.current;

            if (taskResult.type === 'stop') {
                throw new Error('Something went wrong with the camera task queue (start task).');
            }

            setCapabilities(taskResult.data.capabilities);
            setTorch(taskResult.data.isTorchOn);

            return taskResult.data.capabilities;
        },
        [runStartTask, runStopTask]
    );

    const stopCamera = useCallback(async () => {
        taskQueue.current = taskQueue.current.then((prevTaskResult) => {
            if (prevTaskResult.type === 'stop') {
                return prevTaskResult;
            }

            const {
                data: { videoEl, stream, isTorchOn }
            } = prevTaskResult;

            setTorch(false);

            return runStopTask(videoEl, stream, isTorchOn);
        });

        const taskResult = await taskQueue.current;

        if (taskResult.type === 'start') {
            throw new Error('Something went wrong with the camera task queue (stop task).');
        }
    }, [runStopTask]);

    useEffect(() => {
        return () => {
            (async () => await stopCamera())();
        };
    }, []);

    return {
        torch,
        capabilities,
        startCamera,
        stopCamera
    };
}
