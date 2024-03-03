import React, { useState, useEffect, Fragment } from 'react';

import { Result } from '@zxing/library';

import Finder from './Finder';
import { useContinuousScanner } from '../hooks/useContinuousScanner';
import { IScannerComponents, IScannerStyles, IBrowserScannerOptions } from '../types';
import { defaultStyles, defaultComponents, defaultOptions } from '../misc';

export interface IScannerProps {
    onResult: (text: string, result: Result) => void;
    onError?: (error: Error) => void;
    enabled?: boolean;
    styles?: IScannerStyles;
    options?: IBrowserScannerOptions;
    components?: IScannerComponents;
}

export const Scanner = (props: IScannerProps) => {
    const { enabled = true, onResult, onError, styles, options, components } = props;

    const [result, setResult] = useState<Result>();

    async function handleOnResult(result: Result) {
        setResult(result);
        onResult(result.getText(), result);
    }

    function handleOnError(error: Error) {
        onError?.(error);
    }

    const newOptions = { ...defaultOptions, ...options };
    const newComponents = { ...defaultComponents, ...components };

    const { ref, startScanning, stopScanning, loading, switchTorch, getSettings } = useContinuousScanner({
        onResult: handleOnResult,
        onError: handleOnError,
        options: newOptions,
        audio: newComponents.audio ?? false
    });

    useEffect(() => {
        enabled ? startScanning() : stopScanning();
    }, [enabled, stopScanning, startScanning]);

    return (
        <Fragment>
            <div style={{ ...defaultStyles.container, ...styles?.container }}>
                <Finder
                    video={ref.current}
                    enabled={enabled}
                    loading={loading}
                    result={result}
                    border={styles?.finderBorder}
                    options={newOptions}
                    count={newComponents.count}
                    onOff={newComponents.onOff}
                    tracker={newComponents.tracker}
                    switchTorch={newComponents.torch ? switchTorch : undefined}
                    startScanning={startScanning}
                    stopScanning={stopScanning}
                    getSettings={getSettings}
                />
                <video
                    ref={ref}
                    autoPlay
                    muted
                    playsInline
                    style={{
                        ...defaultStyles.video,
                        ...styles?.video
                    }}
                />
            </div>
        </Fragment>
    );
};
