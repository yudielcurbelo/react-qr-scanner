import React, { Fragment, useState, useEffect } from 'react';

import { Result } from '@zxing/library';

import Tracker from './Tracker';
import Counter from './Counter';

interface FinderProps {
    scanCount: number;
    hideCount: boolean;
    tracker: boolean;
    border?: number;
    result?: Result;
    video: HTMLVideoElement | null;
    constraints?: MediaTrackConstraints;
    deviceId?: string;
    scanDelay: number;
}

export const Finder = (props: FinderProps) => {
    const { scanCount, hideCount, tracker, border = 80, result, video, constraints, deviceId, scanDelay } = props;

    const [color, setColor] = useState('rgba(255, 0, 0, 0.5)');

    useEffect(() => {
        if (result?.getBarcodeFormat() == 11 && tracker) {
            setColor('rgba(255, 0, 0, 0.5)');

            return;
        }

        setColor('rgba(0, 255, 0, 0.5)');

        let timer = setTimeout(() => {
            setColor('rgba(255, 0, 0, 0.5)');
        }, scanDelay);

        return () => {
            clearTimeout(timer);
        };
    }, [scanCount]);

    return (
        <Fragment>
            {!hideCount && <Counter scanCount={scanCount} />}
            {tracker && <Tracker video={video} result={result} constraints={constraints} deviceId={deviceId} scanDelay={scanDelay} />}
            <svg
                viewBox="0 0 100 100"
                style={{
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    boxSizing: 'border-box',
                    border: `${border}px solid rgba(0, 0, 0, 0.1)`,
                    position: 'absolute',
                    width: '100%',
                    height: '100%'
                }}
            >
                <path fill="none" d="M23,0 L0,0 L0,23" stroke={color} strokeWidth="5" />
                <path fill="none" d="M0,77 L0,100 L23,100" stroke={color} strokeWidth="5" />
                <path fill="none" d="M77,100 L100,100 L100,77" stroke={color} strokeWidth="5" />
                <path fill="none" d="M100,23 L100,0 77,0" stroke={color} strokeWidth="5" />
            </svg>
        </Fragment>
    );
};
