import type { CSSProperties } from 'react';

export interface IScannerStyles {
    container?: CSSProperties;
    video?: CSSProperties;

    // Custom styles for the Finder component
    borderBox?: React.CSSProperties;
    fullContainer?: React.CSSProperties;
    innerContainer?: React.CSSProperties;
    overlay?: React.CSSProperties;

    // Common style for all four corners
    corners?: React.CSSProperties;
    // Custom style for the specific corners
    cornerTopLeft?: React.CSSProperties;
    cornerTopRight?: React.CSSProperties;
    cornerBottomLeft?: React.CSSProperties;
    cornerBottomRight?: React.CSSProperties;

    // Buttons
    onOff?: React.CSSProperties;
    torch?: React.CSSProperties;
    zoom?: React.CSSProperties;
}
