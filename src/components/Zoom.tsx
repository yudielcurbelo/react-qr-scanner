import React, { Fragment } from 'react';

import ZoomIn from '../assets/ZoomIn';
import ZoomOut from '../assets/ZoomOut';

interface IZoomProps {
    scanning: boolean;
    capabilities: { min: number; max: number; step: number };
    value: number;
    onZoom: (value: number) => void;
}

export default function Zoom(props: IZoomProps) {
    const { scanning, capabilities, onZoom, value } = props;

    if (!scanning || !onZoom) {
        return null;
    }

    const stepSize = (capabilities.max - capabilities.min) / 3;

    function handleZoomIn() {
        onZoom(Math.min(value + stepSize, capabilities.max));
    }

    function handleZoomOut() {
        onZoom(Math.max(value - stepSize, capabilities.min));
    }

    return (
        <Fragment>
            <div style={{ bottom: 130, right: 3, position: 'absolute', zIndex: 2, cursor: 'pointer' }}>
                <ZoomOut disabled={value <= capabilities.min} onClick={handleZoomOut} />
            </div>
            <div style={{ bottom: 180, right: 3, position: 'absolute', zIndex: 2, cursor: 'pointer' }}>
                <ZoomIn disabled={value >= capabilities.max} onClick={handleZoomIn} />
            </div>
        </Fragment>
    );
}
