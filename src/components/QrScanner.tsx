import React, { useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';

import { Result } from '@zxing/library';

import { Finder } from './Finder';
import { IUseQrScannerProps, useQrScanner } from '../hooks/useQrScanner';
import { OnResultFunction } from '../types';
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

export interface IQrScannerProps extends Omit<IUseQrScannerProps, 'onResult' | 'scanDelay' | 'constraints'> {
    containerStyle?: CSSProperties;
    videoStyle?: CSSProperties;
    onResult?: OnResultFunction;
    onDecode?: (result: string) => void;
    viewFinder?: (props: any) => ReactElement | null;
    hideCount?: boolean;
    tracker?: boolean;
    viewFinderBorder?: number;
    constraints?: MediaTrackConstraints;
    scanDelay?: number;
}

export const QrScanner = (props: IQrScannerProps) => {
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
                style={{
                    ...styles.video,
                    ...videoStyle
                }}
            />
        </div>
    );
};
