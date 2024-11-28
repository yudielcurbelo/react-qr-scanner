export const defaultConstraints: MediaTrackConstraints = {
    facingMode: 'environment',
    width: { min: 640, ideal: 720, max: 1920 },
    height: { min: 640, ideal: 720, max: 1080 },
    advanced: [{ zoom: 2 }] // デフォルトのズーム倍率を設定
};
