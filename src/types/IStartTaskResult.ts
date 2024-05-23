export interface IStartTaskResult {
    type: 'start';
    data: {
        videoEl: HTMLVideoElement;
        stream: MediaStream;
        capabilities: Partial<MediaTrackCapabilities>;
        constraints: MediaTrackConstraints;
        isTorchOn: boolean;
    };
}
