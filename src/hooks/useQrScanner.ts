import { useEffect, useRef, useCallback, useState, useMemo } from 'react';

import { BrowserMultiFormatReader, DecodeContinuouslyCallback, DecodeHintType, NotFoundException } from '@zxing/library';

import { OnResultFunction, OnErrorFunction } from '../types';
import deepEqual from '../utilities/deepEqual';

export interface IUseQrScannerProps {
    onResult: OnResultFunction;
    onError: OnErrorFunction;
    scanDelay?: number;
    constraints?: MediaTrackConstraints;
    deviceId?: string;
    hints?: Map<DecodeHintType, any>;
}

const defaultConstraints: MediaTrackConstraints = {
    facingMode: 'environment',
    width: { min: 640, ideal: 720, max: 1920 },
    height: { min: 640, ideal: 720, max: 1080 }
};

export const useQrScanner = (props: IUseQrScannerProps) => {
    const { onResult, onError, scanDelay = 1000, hints, deviceId } = props;

    const onResultRef = useRef(onResult);
    const onErrorRef = useRef(onError);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [constraints, setConstraints] = useState(props.constraints);

    const reader = useMemo(() => new BrowserMultiFormatReader(hints, scanDelay), []);

    const onDecode = useCallback<DecodeContinuouslyCallback>((result, error) => {
        if (result) onResultRef.current(result);
        if (error && !(error instanceof NotFoundException)) onErrorRef.current(error);
    }, []);

    const startDecoding = useCallback(async () => {
        if (!videoRef.current) return;

        if (deviceId) {
            await reader.decodeFromVideoDevice(deviceId, videoRef.current, onDecode);
        } else {
            let newConstraints: MediaStreamConstraints = {
                audio: false,
                video: constraints ?? defaultConstraints
            };

            await reader.decodeFromConstraints(newConstraints, videoRef.current, onDecode);
        }
    }, [reader, deviceId, constraints, onDecode]);

    const stopDecoding = useCallback(() => {
        reader.reset();
    }, [reader]);

    useEffect(() => {
        const isEqual = deepEqual(props.constraints, constraints);

        if (!isEqual) {
            setConstraints(props.constraints);
        }
    }, [props.constraints]);

    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        (async () => {
            await startDecoding();
        })();
        return () => {
            stopDecoding();
        };
    }, [startDecoding, stopDecoding]);

    return { ref: videoRef, start: startDecoding, stop: stopDecoding };
};
