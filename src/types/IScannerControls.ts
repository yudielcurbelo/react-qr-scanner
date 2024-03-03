interface IScannerControls {
    stop: () => Promise<void>;

    switchTorch?: (onOff: boolean) => Promise<void>;

    setStreamVideoConstraints?: (constraints: MediaTrackConstraints, trackFilter?: (track: MediaStreamTrack) => MediaStreamTrack[]) => void;

    getStreamVideoConstraints?: (trackFilter: (track: MediaStreamTrack) => MediaStreamTrack[]) => MediaTrackConstraints;

    getStreamVideoSettings?: (trackFilter: (track: MediaStreamTrack) => MediaStreamTrack[]) => MediaTrackSettings;

    getStreamVideoCapabilities?: (trackFilter: (track: MediaStreamTrack) => MediaStreamTrack[]) => MediaTrackCapabilities;
}

export default IScannerControls;
