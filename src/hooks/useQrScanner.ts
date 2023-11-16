import { useEffect, useRef, useCallback, useState, useMemo } from 'react';

import {
    BrowserMultiFormatReader,
    DecodeContinuouslyCallback,
    DecodeHintType,
    NotFoundException
} from '@zxing/library';

import deepEqual from '../utilities/deepEqual';
import { OnResultFunction, OnErrorFunction } from '../types';

export interface IUseQrScannerProps {
    onResult: OnResultFunction;
    onError: OnErrorFunction;
    scanDelay: number;
    constraints: MediaTrackConstraints;
    deviceId?: string;
    hints?: Map<DecodeHintType, any>;
}

export const useQrScanner = (props: IUseQrScannerProps) => {
    const { onResult, onError, scanDelay, hints, deviceId } = props;

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

        try {
            if (deviceId) {
                await reader.decodeFromVideoDevice(deviceId, videoRef.current, onDecode);
            } else {
                let newConstraints: MediaStreamConstraints = {
                    audio: false,
                    video: constraints
                };

                await reader.decodeFromConstraints(newConstraints, videoRef.current, onDecode);
            }
        } catch (error) {
            onErrorRef.current(error as Error);
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
        let isMounted = true;

        (async () => {
            await startDecoding();

            if (!isMounted) {
                stopDecoding();
            }
        })();

        return () => {
            isMounted = false;
            stopDecoding();
        };
    }, [startDecoding, stopDecoding]);


    return { ref: videoRef, start: startDecoding, stop: stopDecoding };
};
