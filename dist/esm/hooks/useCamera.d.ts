import { IStartCamera } from '../types';
export default function useCamera(): {
    capabilities: MediaTrackCapabilities;
    settings: MediaTrackSettings;
    startCamera: (videoEl: HTMLVideoElement, { constraints, restart }: IStartCamera) => Promise<void>;
    stopCamera: () => Promise<void>;
    updateConstraints: (newConstraints: MediaTrackConstraints) => Promise<void>;
};
//# sourceMappingURL=useCamera.d.ts.map