import { MutableRefObject, useEffect, useRef } from 'react';

import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

import { OnResultFunction, OnErrorFunction } from '../types';

import { isStreamApiSupported } from '../misc';

export interface IUseQrScannerProps {
    constraints: MediaTrackConstraints;
    onResult: OnResultFunction;
    onError: OnErrorFunction;
    scanDelay: number;
    videoId: string;
}

export const useQrScanner = (props: IUseQrScannerProps): void => {
    const {
        scanDelay,
        constraints,
        onResult,
        onError,
        videoId
    } = props;

    const controlsRef: MutableRefObject<IScannerControls | null> = useRef(null);

    useEffect(() => {
        (async () => {
            const codeReader = new BrowserQRCodeReader(undefined, {
                delayBetweenScanAttempts: scanDelay
            });

            isStreamApiSupported();

            try {
                controlsRef.current = await codeReader.decodeFromConstraints({ video: constraints }, videoId, (result, error) => {
                    if (result !== undefined) {
                        onResult(result, codeReader);
                    }

                    if (error !== undefined) {
                        // do nothing
                    }
                });

            } catch (error) {
                if (error instanceof Error) {
                    onError(error, codeReader);
                }
            }
        })();

        return () => {
            controlsRef.current?.stop();
        };
    }, []);
};