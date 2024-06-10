interface HTMLVideoElement {
    mozSrcObject?: HTMLVideoElement['srcObject'];
}

interface MediaTrackCapabilities {
    torch?: boolean;
    zoom?: {
        min: number;
        max: number;
        step: number;
    };
}

interface MediaTrackConstraintSet {
    torch?: boolean;
    zoom?: number;
}

interface MediaTrackSettings {
    zoom?: number;
    torch?: boolean;
}
