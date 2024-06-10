export interface IStartTaskResult {
    type: 'start';
    data: {
        videoEl: HTMLVideoElement;
        stream: MediaStream;
        constraints: MediaTrackConstraints;
    };
}
