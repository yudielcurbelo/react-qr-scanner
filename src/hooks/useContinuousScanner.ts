import { useEffect, useCallback, useRef, useState, RefObject } from 'react';

import { ChecksumException, Exception, FormatException, NotFoundException, Result } from '@zxing/library';

import { BrowserMultiFormatScanner } from '../scanners/BrowserMultiFormatScanner';
import { IBrowserScannerOptions, IScannerControl, OnErrorFunction, OnResultFunction } from '../types';
import { BrowserScanner } from '../scanners/BrowserScanner';
import deepEqual from '../utilities/deepEqual';

import { base64Beep } from '../assets/base64Beep';

interface IUseContinuousScannerProps {
    onResult: OnResultFunction;
    onError: OnErrorFunction;
    options: IBrowserScannerOptions;
    audio: boolean;
}

interface IUseContinuousScannerReturn {
    ref: RefObject<HTMLVideoElement>;
    startScanning: () => void;
    stopScanning: () => void;
    loading: boolean;
    switchTorch?: (value: boolean) => void;
    getSettings?: () => MediaTrackSettings | undefined;
}

export function useContinuousScanner(props: IUseContinuousScannerProps): IUseContinuousScannerReturn {
    const { onResult, onError, audio } = props;

    const isScanningRef = useRef(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef(new Audio(base64Beep));
    const controlRef = useRef<IScannerControl | undefined>(undefined);
    const onResultRef = useRef(onResult);
    const onErrorRef = useRef(onError);

    const [options, setOptions] = useState<IBrowserScannerOptions>(props.options);
    const [hasTorch, setHasTorch] = useState(false);
    const [loading, setLoading] = useState(false);

    const getSettings = useCallback(() => {
        return controlRef.current?.getStreamVideoSettings?.((track) => [track]);
    }, []);

    const switchTorch = useCallback((value: boolean) => {
        controlRef.current?.switchTorch?.(value);
    }, []);

    const stopScanning = useCallback(() => {
        isScanningRef.current = false;

        controlRef.current?.switchTorch?.(false);
        controlRef.current?.stop();
        controlRef.current = undefined;

        audioRef.current.pause();

        setHasTorch(false);

        BrowserScanner.releaseAllStreams();

        if (videoRef.current) {
            BrowserScanner.cleanVideoSource(videoRef.current);
        }
    }, []);

    const handleResultOrError = useCallback(
        (result: Result | null, error: Exception | undefined) => {
            if (result) {
                if (result.getText() === '') {
                    return;
                }

                if (audio && audioRef.current && result.getText() !== '') {
                    audioRef.current.play().catch((error) => console.error('Error playing the sound', error));
                }

                onResultRef.current(result);
            } else if (error) {
                const errorName = error.name;

                if (error instanceof NotFoundException) {
                    return;
                }

                if (error instanceof DOMException && errorName === 'IndexSizeError') {
                    return;
                }

                if (
                    errorName === NotFoundException.name ||
                    errorName === ChecksumException.name ||
                    errorName === FormatException.name ||
                    error.message.includes('No MultiFormat Readers were able to detect the code.')
                ) {
                    onErrorRef.current(error);
                } else {
                    onErrorRef.current(error);
                    stopScanning();
                }
            }
        },
        [stopScanning, audio]
    );

    const startScanning = useCallback(async () => {
        if (!videoRef.current || isScanningRef.current) {
            return;
        }

        isScanningRef.current = true;

        const reader = new BrowserMultiFormatScanner(options);

        try {
            setLoading(true);

            if (options.deviceId) {
                controlRef.current = await reader.decodeFromVideoDevice(options.deviceId, videoRef.current, handleResultOrError);
            } else {
                let newConstraints: MediaStreamConstraints = {
                    audio: false,
                    video: options?.constraints
                };

                controlRef.current = await reader.decodeFromConstraints(newConstraints, videoRef.current, handleResultOrError);
            }

            setLoading(false);

            if (controlRef.current?.switchTorch) {
                setHasTorch(true);
            }
        } catch (error) {
            onError(error as Error);
            stopScanning();
        }
    }, [stopScanning, options, handleResultOrError]);

    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        return () => stopScanning();
    }, [stopScanning]);

    useEffect(() => {
        const isEqual = deepEqual(options, props.options);

        if (!isEqual) {
            isScanningRef.current = false;
            setHasTorch(false);
            setOptions(props.options);
        }
    }, [props.options]);

    return {
        ref: videoRef,
        startScanning,
        stopScanning,
        loading,
        switchTorch: hasTorch ? switchTorch : undefined,
        getSettings
    };
}
