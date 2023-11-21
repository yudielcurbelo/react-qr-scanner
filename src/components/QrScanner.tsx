import React, { useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';

import { DecodeHintType, Result } from '@zxing/library';

import { Finder } from './Finder';
import { useQrScanner } from '../hooks/useQrScanner';
import { OnErrorFunction, OnResultFunction } from '../types';
import { defaultConstraints } from '../misc/defaultConstraints';

const styles: Record<string, CSSProperties> = {
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

export interface QrScannerProps {
    onError: OnErrorFunction;
    onResult?: OnResultFunction;
    containerStyle?: CSSProperties;
    videoStyle?: CSSProperties;
    onDecode?: (result: string) => void;
    viewFinder?: (props: any) => ReactElement | null;
    hideCount?: boolean;
    tracker?: boolean;
    viewFinderBorder?: number;
    constraints?: MediaTrackConstraints;
    scanDelay?: number;
    deviceId?: string;
    hints?: Map<DecodeHintType, any>;
    stopDecoding?: boolean;
}

export const QrScanner = (props: QrScannerProps) => {
    const {
        containerStyle,
        videoStyle,
        constraints = defaultConstraints,
        onResult,
        onDecode,
        viewFinder: ViewFinder,
        hideCount = true,
        tracker = false,
        viewFinderBorder,
        deviceId,
        scanDelay = 100,
        ...rest
    } = props;

    const [scanCount, setScanCount] = useState(0);
    const [result, setResult] = useState<Result>();

    const handleOnResult = (result: Result) => {
        setResult(result);

        if (onResult) onResult(result);
        if (onDecode) onDecode(result.getText());

        setScanCount((count) => count + 1);
    };

    const { ref } = useQrScanner({ onResult: handleOnResult, constraints, deviceId, scanDelay, ...rest });

    return (
        <div style={{ ...styles.container, ...containerStyle }}>
            {!ViewFinder ? (
                <Finder
                    video={ref.current}
                    result={result}
                    scanCount={scanCount}
                    hideCount={hideCount}
                    tracker={tracker}
                    border={viewFinderBorder}
                    constraints={constraints}
                    deviceId={deviceId}
                    scanDelay={scanDelay}
                />
            ) : (
                <ViewFinder />
            )}
            <video
                ref={ref}
                muted
                playsInline
                style={{
                    ...styles.video,
                    ...videoStyle
                }}
            />
        </div>
    );
};
