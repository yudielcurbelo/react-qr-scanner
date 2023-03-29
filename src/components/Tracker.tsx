import React, { useEffect, useRef } from 'react';
import { Result } from '@zxing/library';
import { useMediaDevices } from '../hooks/useMediaDevices';

interface TrackerProps {
    result?: Result;
    video: HTMLVideoElement | null;
    constraints?: MediaTrackConstraints;
    deviceId?: string;
    scanDelay: number;
}

const Tracker = (props: TrackerProps) => {
    const { result, video, constraints, deviceId, scanDelay } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const devices = useMediaDevices(constraints);

    useEffect(() => {
        if (result === undefined || canvasRef.current === null || video === null || result.getBarcodeFormat() !== 11) {
            return;
        }

        let device: MediaTrackSettings = devices[0];

        if (deviceId !== undefined && devices.length > 1) {
            let value = devices.find((d) => d.deviceId === deviceId);

            if (value !== undefined) {
                device = value;
            }
        }

        if (device === undefined || device.width === undefined) {
            return;
        }

        const scaleFactor = device.width / video.clientWidth;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx === null) {
            return;
        }

        const timer = setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, scanDelay);

        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 4;

        // bottom left
        const point0 = result.getResultPoints()[0] as unknown as { getX: () => number; getY: () => number; estimatedModuleSize: number };

        ctx.beginPath();
        ctx.arc(point0.getX() / scaleFactor, point0.getY() / scaleFactor, point0.estimatedModuleSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        // top left
        const point1 = result.getResultPoints()[1] as unknown as { getX: () => number; getY: () => number; estimatedModuleSize: number };

        ctx.beginPath();
        ctx.arc(point1.getX() / scaleFactor, point1.getY() / scaleFactor, point1.estimatedModuleSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        // top right
        const point2 = result.getResultPoints()[2] as unknown as { getX: () => number; getY: () => number; estimatedModuleSize: number };

        ctx.beginPath();
        ctx.arc(point2.getX() / scaleFactor, point2.getY() / scaleFactor, point2.estimatedModuleSize, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        // bottom right
        if (result.getResultPoints().length >= 4) {
            const point3 = result.getResultPoints()[3] as unknown as { getX: () => number; getY: () => number; estimatedModuleSize: number };

            ctx.beginPath();
            ctx.arc(point3.getX() / scaleFactor, point3.getY() / scaleFactor, point3.estimatedModuleSize, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        }

        return () => clearTimeout(timer);
    });

    return <canvas ref={canvasRef} width={video?.clientWidth ?? 0} height={video?.clientHeight ?? 0} style={{ position: 'absolute', top: 0, zIndex: 2 }}></canvas>;
};

export default Tracker;
