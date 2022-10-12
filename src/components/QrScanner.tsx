import React, { useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';

import { Result } from '@zxing/library';

import { Finder } from './Finder';
import { IUseQrScannerProps, useQrScanner } from '../hooks/useQrScanner';

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

export interface IQrScannerProps extends IUseQrScannerProps {
    containerStyle?: CSSProperties;
    videoStyle?: CSSProperties;
    onDecode?: (result: string) => void;
    viewFinder?: (props: any) => ReactElement | null;
    hideCount?: boolean;
    viewFinderBorder?: number;
}

export const QrScanner = (props: IQrScannerProps) => {
    const {
        containerStyle,
        videoStyle,
        constraints,
        onResult,
        onDecode,
        viewFinder: ViewFinder,
        hideCount = true,
        viewFinderBorder,
        ...rest
    } = props;

    const [scanCount, setScanCount] = useState(0);

    const handleOnResult = (result: Result) => {
        if (onResult) onResult(result);
        if (onDecode) onDecode(result.getText());

        setScanCount((count) => count + 1);
    };

    const { ref } = useQrScanner({ onResult: handleOnResult, ...rest });

    return (
        <div style={{ ...styles.container, ...containerStyle }}>
            {!ViewFinder ? <Finder scanCount={scanCount} hideCount={hideCount} border={viewFinderBorder} /> :
                <ViewFinder />}
            <video ref={ref}
                   muted
                   style={{
                       ...styles.video,
                       ...videoStyle,
                       transform: constraints?.facingMode === 'user' ? 'scaleX(-1)' : 'none'
                   }}
            />
        </div>
    );
};
