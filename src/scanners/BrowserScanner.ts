import { DecodeContinuouslyCallback, ArgumentException, BinaryBitmap, ChecksumException, FormatException, HybridBinarizer, NotFoundException, Reader, Result, Exception } from '@zxing/library';

import { HTMLCanvasElementLuminanceSource } from './HTMLCanvasElementLuminanceSource';
import { HTMLVisualMediaElement } from '../types/HTMLVisualMediaElement';
import { IBrowserScannerOptions, IScannerControl } from '../types';
import { canEnumerateDevices, hasNavigator } from '../utilities/browser';

export class BrowserScanner {
    private static streamTracker: MediaStream[] = [];

    public constructor(protected readonly reader: Reader, public readonly options: IBrowserScannerOptions) {}

    // Public Decodes
    public decodeBitmap(binaryBitmap: BinaryBitmap): Result {
        return this.reader.decode(binaryBitmap, this.options.hints);
    }

    public decodeFromCanvas(canvas: HTMLCanvasElement): Result {
        const binaryBitmap = BrowserScanner.createBinaryBitmapFromCanvas(canvas);

        return this.decodeBitmap(binaryBitmap);
    }

    public async decodeFromConstraints(constraints: MediaStreamConstraints, previewElem: string | HTMLVideoElement | undefined, callbackFn: DecodeContinuouslyCallback): Promise<IScannerControl> {
        BrowserScanner.checkCallbackFnOrThrow(callbackFn);

        const stream = await this.getUserMedia(constraints);

        try {
            return await this.decodeFromStream(stream, previewElem, callbackFn);
        } catch (error) {
            BrowserScanner.disposeMediaStream(stream);

            throw error;
        }
    }

    public async decodeFromStream(stream: MediaStream, preview: string | HTMLVideoElement | undefined, callbackFn: DecodeContinuouslyCallback): Promise<IScannerControl> {
        BrowserScanner.checkCallbackFnOrThrow(callbackFn);

        const video = await BrowserScanner.attachStreamToVideo(stream, preview, this.options.tryPlayVideoTimeout);

        const finalizeCallback = () => {
            BrowserScanner.disposeMediaStream(stream);
            BrowserScanner.cleanVideoSource(video);
        };

        const originalControls = this.scan(video, callbackFn, finalizeCallback);

        const videoTracks = stream.getVideoTracks();

        const controls: IScannerControl = {
            ...originalControls,

            async stop() {
                await originalControls.stop();
            },

            async setStreamVideoConstraints(constraints: MediaTrackConstraints, trackFilter?: (track: MediaStreamTrack) => MediaStreamTrack[]) {
                const tracks = trackFilter ? videoTracks.filter(trackFilter) : videoTracks;

                for (const track of tracks) {
                    await track.applyConstraints(constraints);
                }
            },

            getStreamVideoConstraints(trackFilter: (track: MediaStreamTrack) => MediaStreamTrack[]) {
                const track = videoTracks.find(trackFilter);

                if (!track) {
                    throw new Error('No track found.');
                }

                return track.getConstraints();
            },

            getStreamVideoSettings(trackFilter: (track: MediaStreamTrack) => MediaStreamTrack[]) {
                const track = videoTracks.find(trackFilter);

                if (!track) {
                    throw new Error('No track found.');
                }

                return track.getSettings();
            },

            getStreamVideoCapabilities(trackFilter: (track: MediaStreamTrack) => MediaStreamTrack[]) {
                const track = videoTracks.find(trackFilter);

                if (!track) {
                    throw new Error('No track found.');
                }

                return track.getCapabilities();
            }
        };

        const isTorchAvailable = BrowserScanner.mediaStreamIsTorchCompatible(stream);

        if (isTorchAvailable) {
            const torchTrack = videoTracks?.find((t) => BrowserScanner.mediaStreamIsTorchCompatibleTrack(t));

            const switchTorch = async (onOff: boolean) => {
                if (!torchTrack) {
                    throw new Error('No torch track available.');
                }

                await BrowserScanner.mediaStreamSetTorch(torchTrack, onOff);
            };

            controls.switchTorch = switchTorch;

            controls.stop = async () => {
                await switchTorch(false);
                await originalControls.stop();
            };
        }

        return controls;
    }

    public async decodeFromVideoDevice(deviceId: string | undefined, previewElem: string | HTMLVideoElement | undefined, callbackFn: DecodeContinuouslyCallback): Promise<IScannerControl> {
        BrowserScanner.checkCallbackFnOrThrow(callbackFn);

        let videoConstraints: MediaTrackConstraints;

        if (!deviceId) {
            videoConstraints = { facingMode: 'environment' };
        } else {
            videoConstraints = { deviceId: { exact: deviceId } };
        }

        const constraints: MediaStreamConstraints = { video: videoConstraints };

        return await this.decodeFromConstraints(constraints, previewElem, callbackFn);
    }

    // Public Utils
    public static cleanVideoSource(videoElement: HTMLVideoElement): void {
        if (!videoElement) {
            return;
        }

        try {
            videoElement.srcObject = null;
        } catch (err) {
            videoElement.src = '';
        }

        if (videoElement) {
            videoElement.removeAttribute('src');
        }
    }

    public static releaseAllStreams() {
        if (BrowserScanner.streamTracker.length !== 0) {
            BrowserScanner.streamTracker.forEach((mediaStream) => {
                mediaStream.getTracks().forEach((track) => track.stop());
            });
        }

        BrowserScanner.streamTracker = [];
    }

    public static async listVideoInputDevices(requestPermission?: boolean): Promise<MediaDeviceInfo[]> {
        if (!hasNavigator()) {
            throw new Error("Can't enumerate devices, navigator is not present.");
        }

        if (!canEnumerateDevices()) {
            throw new Error("Can't enumerate devices, method not supported.");
        }

        if (requestPermission) {
            await navigator.mediaDevices.getUserMedia({ video: true });
        }

        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoDevices: MediaDeviceInfo[] = [];

        for (const device of devices) {
            const kind = (device.kind as string) === 'video' ? 'videoinput' : device.kind;

            if (kind !== 'videoinput') {
                continue;
            }

            const deviceId = device.deviceId || (device as any).id;
            const label = device.label || `Video device ${videoDevices.length + 1}`;
            const groupId = device.groupId;

            const videoDevice = { deviceId, label, kind, groupId } as MediaDeviceInfo;

            videoDevices.push(videoDevice);
        }

        return videoDevices;
    }

    // Private
    private static addVideoSource(videoElement: HTMLVideoElement, stream: MediaStream): void {
        try {
            videoElement.srcObject = stream;
        } catch (err) {
            console.error('Got interrupted by new loading request');
        }
    }

    private static async mediaStreamSetTorch(track: MediaStreamTrack, onOff: boolean) {
        await track.applyConstraints({
            advanced: [
                {
                    fillLightMode: onOff ? 'flash' : 'off',
                    torch: onOff
                } as any
            ]
        });
    }

    private static mediaStreamIsTorchCompatible(params: MediaStream) {
        const tracks = params.getVideoTracks();

        for (const track of tracks) {
            if (BrowserScanner.mediaStreamIsTorchCompatibleTrack(track)) {
                return true;
            }
        }

        return false;
    }

    private static mediaStreamIsTorchCompatibleTrack(track: MediaStreamTrack) {
        try {
            const capabilities = track.getCapabilities();

            return 'torch' in capabilities;
        } catch (err) {
            console.error(err);
            console.warn('Your browser may be not fully compatible with WebRTC and/or ImageCapture specs. Torch will not be available.');

            return false;
        }
    }

    private static isVideoPlaying(video: HTMLVideoElement): boolean {
        return video.currentTime > 0 && !video.paused && video.readyState > 2;
    }

    private static getMediaElement(mediaElementId: string, type: string): HTMLVisualMediaElement {
        const mediaElement = document.getElementById(mediaElementId);

        if (!mediaElement) {
            throw new ArgumentException(`element with id '${mediaElementId}' not found`);
        }

        if (mediaElement.nodeName.toLowerCase() !== type.toLowerCase()) {
            throw new ArgumentException(`element with id '${mediaElementId}' must be an ${type} element`);
        }

        return mediaElement as HTMLVisualMediaElement;
    }

    private static createVideoElement(videoThingy?: HTMLVideoElement | string): HTMLVideoElement {
        if (videoThingy instanceof HTMLVideoElement) {
            return videoThingy;
        }

        if (typeof videoThingy === 'string') {
            return BrowserScanner.getMediaElement(videoThingy, 'video') as HTMLVideoElement;
        }

        if (!videoThingy && typeof document !== 'undefined') {
            const videoElement = document.createElement('video');
            videoElement.width = 200;
            videoElement.height = 200;
            return videoElement;
        }

        throw new Error("Couldn't get videoElement from videoSource!");
    }

    private static prepareVideoElement(videoElem?: HTMLVideoElement | string): HTMLVideoElement {
        const videoElement = BrowserScanner.createVideoElement(videoElem);

        // Needed for iOS
        videoElement.setAttribute('autoplay', 'true');
        videoElement.setAttribute('muted', 'true');
        videoElement.setAttribute('playsinline', 'true');

        return videoElement;
    }

    private static createBinaryBitmapFromCanvas(canvas: HTMLCanvasElement) {
        const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
        const hybridBinarizer = new HybridBinarizer(luminanceSource);

        return new BinaryBitmap(hybridBinarizer);
    }

    private static drawImageOnCanvas(canvasElementContext: CanvasRenderingContext2D, srcElement: HTMLVisualMediaElement) {
        canvasElementContext.drawImage(srcElement, 0, 0);
    }

    private static getMediaElementDimensions(mediaElement: HTMLVisualMediaElement) {
        if (mediaElement instanceof HTMLVideoElement) {
            return {
                height: mediaElement.videoHeight,
                width: mediaElement.videoWidth
            };
        }

        if (mediaElement instanceof HTMLImageElement) {
            return {
                height: mediaElement.naturalHeight || mediaElement.height,
                width: mediaElement.naturalWidth || mediaElement.width
            };
        }

        throw new Error("Couldn't find the Source's dimensions!");
    }

    private static createCaptureCanvas(mediaElement: HTMLVisualMediaElement): HTMLCanvasElement {
        if (!mediaElement) {
            throw new ArgumentException('Cannot create a capture canvas without a media element.');
        }

        if (typeof document === 'undefined') {
            throw new Error('The page "Document" is undefined, make sure you are running in a browser.');
        }

        const canvasElement = document.createElement('canvas');

        const { width, height } = BrowserScanner.getMediaElementDimensions(mediaElement);

        canvasElement.style.width = width + 'px';
        canvasElement.style.height = height + 'px';
        canvasElement.width = width;
        canvasElement.height = height;

        return canvasElement;
    }

    private static async tryPlayVideo(videoElement: HTMLVideoElement): Promise<boolean> {
        if (videoElement?.ended) {
            console.error('Trying to play video that has ended.');

            return false;
        }

        if (BrowserScanner.isVideoPlaying(videoElement)) {
            console.warn('Trying to play video that is already playing.');

            return true;
        }

        try {
            await videoElement.play();

            return true;
        } catch (error) {
            console.warn('It was not possible to play the video.', error);

            return false;
        }
    }

    private static async playVideoOnLoadAsync(element: HTMLVideoElement, timeout: number): Promise<boolean> {
        const isPlaying = await BrowserScanner.tryPlayVideo(element);

        if (isPlaying) {
            return true;
        }

        return new Promise<boolean>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                if (BrowserScanner.isVideoPlaying(element)) {
                    return;
                }

                reject(false);
                element.removeEventListener('canplay', videoCanPlayListener);
            }, timeout);

            const videoCanPlayListener: EventListener = () => {
                BrowserScanner.tryPlayVideo(element).then((hasPlayed) => {
                    clearTimeout(timeoutId);
                    element.removeEventListener('canplay', videoCanPlayListener);
                    resolve(hasPlayed);
                });
            };

            element.addEventListener('canplay', videoCanPlayListener);
        });
    }

    private static async attachStreamToVideo(stream: MediaStream, preview?: string | HTMLVideoElement, previewPlayTimeout: number = 3000): Promise<HTMLVideoElement> {
        const videoElement = BrowserScanner.prepareVideoElement(preview);

        BrowserScanner.addVideoSource(videoElement, stream);

        await BrowserScanner.playVideoOnLoadAsync(videoElement, previewPlayTimeout);

        return videoElement;
    }

    private scan(element: HTMLVisualMediaElement, callbackFn: DecodeContinuouslyCallback, finalizeCallback?: (error?: Error) => void): IScannerControl {
        BrowserScanner.checkCallbackFnOrThrow(callbackFn);

        let captureCanvas = BrowserScanner.createCaptureCanvas(element);
        let captureCanvasContext = captureCanvas.getContext('2d', { willReadFrequently: true });

        if (!captureCanvasContext) {
            throw new Error("Couldn't create canvas for visual element scan.");
        }

        const disposeCanvas = () => {
            captureCanvasContext = null;
        };

        let stopScan = false;
        let lastTimeoutId: null | ReturnType<typeof setTimeout>;

        const stop = async () => {
            stopScan = true;

            if (lastTimeoutId) {
                clearTimeout(lastTimeoutId);
            }

            disposeCanvas();

            if (finalizeCallback) {
                finalizeCallback();
            }
        };

        const controls = { stop };

        const loop = () => {
            if (stopScan) {
                return;
            }

            let result: Result = new Result('', new Uint8Array(0), 0, [], 0, 0);

            try {
                if (!captureCanvasContext) {
                    callbackFn(result, new Exception('Canvas is not available'));

                    return;
                }

                BrowserScanner.drawImageOnCanvas(captureCanvasContext, element);
                result = this.decodeFromCanvas(captureCanvas);

                callbackFn(result, undefined);
                lastTimeoutId = setTimeout(loop, this.options.delayBetweenScanSuccess);
            } catch (error) {
                callbackFn(result, error as Exception);

                const isChecksumError = error instanceof ChecksumException;
                const isFormatError = error instanceof FormatException;
                const isNotFound = error instanceof NotFoundException;

                if (isChecksumError || isFormatError || isNotFound) {
                    lastTimeoutId = setTimeout(loop, this.options.delayBetweenScanAttempts);

                    return;
                }

                disposeCanvas();

                if (finalizeCallback) {
                    finalizeCallback(error as Error);
                }
            }
        };

        loop();

        return controls;
    }

    private async getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        BrowserScanner.streamTracker.push(stream);

        return stream;
    }

    private static checkCallbackFnOrThrow(callbackFn: DecodeContinuouslyCallback) {
        if (!callbackFn) {
            throw new ArgumentException('`callbackFn` is a required parameter, you cannot capture results without it.');
        }
    }

    private static disposeMediaStream(stream: MediaStream) {
        stream.getVideoTracks().forEach((x) => x.stop());
    }
}
