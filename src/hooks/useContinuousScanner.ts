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
    scanning: boolean;
    switchTorch?: (value: boolean) => void;
    getSettings?: () => MediaTrackSettings | undefined;
}

export function useContinuousScanner(props: IUseContinuousScannerProps): IUseContinuousScannerReturn {
    const { onResult, onError, audio } = props;

    const scanningRef = useRef(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef(new Audio(base64Beep));
    const controlRef = useRef<IScannerControl | undefined>(undefined);
    const onResultRef = useRef(onResult);
    const onErrorRef = useRef(onError);

    const [options, setOptions] = useState<IBrowserScannerOptions>(props.options);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);

    const getSettings = useCallback(() => {
        return controlRef.current?.getStreamVideoSettings?.((track) => [track]);
    }, []);

    const switchTorch = useCallback((value: boolean) => {
        controlRef.current?.switchTorch?.(value);
    }, []);

    const stopScanning = useCallback(async () => {
        setScanning(false);

        await controlRef.current?.stop();
        controlRef.current = undefined;

        audioRef.current.pause();

        BrowserScanner.releaseAllStreams();
    }, []);

    const handleResultOrError = useCallback(
        async (result: Result | null, error: Exception | undefined) => {
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
                    await stopScanning();
                }
            }
        },
        [stopScanning, audio]
    );

    const startScanning = useCallback(async () => {
        console.log('startScanning');

        if (!videoRef.current || scanningRef.current) {
            return;
        }

        setScanning(true);

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
        } catch (error) {
            onError(error as Error);
            await stopScanning();
        }
    }, [stopScanning, options, handleResultOrError]);

    useEffect(() => {
        scanningRef.current = scanning;
    }, [scanning]);

    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        return () => {
            (async () => await stopScanning())();
        };
    }, [stopScanning]);

    useEffect(() => {
        const isEqual = deepEqual(options, props.options);

        if (!isEqual) {
            setScanning(false);
            setOptions(props.options);
        }
    }, [props.options]);

    return {
        ref: videoRef,
        startScanning,
        stopScanning,
        loading,
        scanning,
        switchTorch: controlRef.current?.switchTorch ? switchTorch : undefined,
        getSettings
    };
}
