export function hasNavigator() {
    return typeof navigator !== 'undefined';
}

export function canEnumerateDevices() {
    return !!(isMediaDevicesSupported() && navigator.mediaDevices.enumerateDevices);
}

function isMediaDevicesSupported() {
    return hasNavigator() && !!navigator.mediaDevices;
}
