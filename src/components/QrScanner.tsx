import React, { FC, ReactElement, useState, useEffect } from 'react';

import { BrowserQRCodeReader } from '@zxing/browser';
import { Result } from '@zxing/library';

import { Finder } from './Finder';
import { useQrScanner } from '../hooks/useQrScanner';

import { OnResultFunction, OnErrorFunction } from '../types';

const styles: any = {
    container: {
        width: '100%',
        paddingTop: '100%',
        overflow: 'hidden',
        position: 'relative'
    },
    video: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        overflow: 'hidden',
        position: 'absolute'
    }
};

export interface IQrScannerProps {
    containerStyle?: any;
    videoStyle?: any;
    scanDelay?: number;
    videoId?: string;
    constraints?: MediaTrackConstraints;
    onResult?: OnResultFunction;
    onError?: OnErrorFunction;
    onDecode?: (result: string) => void;
    viewFinder?: (props: any) => ReactElement | null;
    hideCount?: boolean;
    viewFinderBorder?:number;
}

const QrScanner: FC<IQrScannerProps> = (props) => {
    const {
        containerStyle,
        videoStyle,
        scanDelay = 500,
        videoId = 'videoId',
        constraints: constraintsProps,
        onResult,
        onError,
        onDecode,
        viewFinder: ViewFinder,
        hideCount = true,
        viewFinderBorder
    } = props;

    const defaultConstraints: MediaTrackConstraints = {
        facingMode: 'environment',
        width: { min: 640, ideal: 720, max: 1920 },
        height: { min: 640, ideal: 720, max: 1080 }
    };

    const [scanCount, setScanCount] = useState(0);
    const [constraints, setConstraints] = useState<MediaTrackConstraints>({ ...defaultConstraints, ...constraintsProps });

    useEffect(() => {
        setConstraints({ ...defaultConstraints, ...constraintsProps });
    }, [constraintsProps]);

    const handleOnResult = (result: Result, codeReader: BrowserQRCodeReader) => {
        if (onResult) onResult(result, codeReader);
        if (onDecode) onDecode(result.getText());

        setScanCount((count) => count + 1);
    };

    const handleOnError: OnErrorFunction = (error: Error, codeReader: BrowserQRCodeReader) => {
        if (onError) onError(error, codeReader);
    };

    useQrScanner({ constraints, scanDelay, onResult: handleOnResult, onError: handleOnError, videoId });

    return (
        <div style={{ ...styles.container, ...containerStyle }}>
            {!ViewFinder ? <Finder scanCount={scanCount} hideCount={hideCount} border={viewFinderBorder} /> : <ViewFinder />}
            <video muted id={videoId}
                   style={{
                       ...styles.video, ...videoStyle,
                       transform: constraints?.facingMode === 'user' && 'scaleX(-1)'
                   }}
            />
        </div>
    );
};

export default QrScanner;