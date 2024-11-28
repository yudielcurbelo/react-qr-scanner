import React from 'react';
interface IZoomProps {
    scanning: boolean;
    capabilities: {
        min: number;
        max: number;
        step: number;
    };
    value: number;
    onZoom: (value: number) => void;
}
export default function Zoom(props: IZoomProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=Zoom.d.ts.map