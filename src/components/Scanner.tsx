import type { BarcodeFormat } from 'barcode-detector';
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import useCamera from '../hooks/useCamera';
import useScanner from '../hooks/useScanner';
import { defaultComponents, defaultConstraints, defaultStyles } from '../misc';
import type {
	IDetectedBarcode,
	IPoint,
	IScannerClassNames,
	IScannerComponents,
	IScannerStyles,
	TrackFunction,
} from '../types';
import deepEqual from '../utilities/deepEqual';
import Finder from './Finder';

export interface IScannerProps {
	onScan: (detectedCodes: IDetectedBarcode[]) => void;
	onError?: (error: unknown) => void;
	constraints?: MediaTrackConstraints;
	formats?: BarcodeFormat[];
	paused?: boolean;
	children?: ReactNode;
	components?: IScannerComponents;
	styles?: IScannerStyles;
	classNames?: IScannerClassNames;
	allowMultiple?: boolean;
	scanDelay?: number;
	sound?: boolean | string;
}

function clearCanvas(canvas: HTMLCanvasElement | null) {
	if (canvas === null) {
		throw new Error(
			'Canvas should always be defined when component is mounted.',
		);
	}

	const ctx = canvas.getContext('2d');

	if (ctx === null) {
		throw new Error('Canvas 2D context should be non-null');
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function onFound(
	detectedCodes: IDetectedBarcode[],
	videoEl?: HTMLVideoElement | null,
	trackingEl?: HTMLCanvasElement | null,
	tracker?: TrackFunction,
) {
	const canvas = trackingEl;

	if (canvas === undefined || canvas === null) {
		throw new Error(
			'onFound handler should only be called when component is mounted. Thus tracking canvas is always defined.',
		);
	}

	const video = videoEl;

	if (video === undefined || video === null) {
		throw new Error(
			'onFound handler should only be called when component is mounted. Thus video element is always defined.',
		);
	}

	if (detectedCodes.length === 0 || tracker === undefined) {
		clearCanvas(canvas);
	} else {
		const displayWidth = video.offsetWidth;
		const displayHeight = video.offsetHeight;

		const resolutionWidth = video.videoWidth;
		const resolutionHeight = video.videoHeight;

		const largerRatio = Math.max(
			displayWidth / resolutionWidth,
			displayHeight / resolutionHeight,
		);
		const uncutWidth = resolutionWidth * largerRatio;
		const uncutHeight = resolutionHeight * largerRatio;

		const xScalar = uncutWidth / resolutionWidth;
		const yScalar = uncutHeight / resolutionHeight;
		const xOffset = (displayWidth - uncutWidth) / 2;
		const yOffset = (displayHeight - uncutHeight) / 2;

		const scale = ({ x, y }: IPoint) => {
			return {
				x: Math.floor(x * xScalar),
				y: Math.floor(y * yScalar),
			};
		};

		const translate = ({ x, y }: IPoint) => {
			return {
				x: Math.floor(x + xOffset),
				y: Math.floor(y + yOffset),
			};
		};

		const adjustedCodes = detectedCodes.map((detectedCode) => {
			const { boundingBox, cornerPoints } = detectedCode;

			const { x, y } = translate(
				scale({
					x: boundingBox.x,
					y: boundingBox.y,
				}),
			);
			const { x: width, y: height } = scale({
				x: boundingBox.width,
				y: boundingBox.height,
			});

			return {
				...detectedCode,
				cornerPoints: cornerPoints.map((point) => translate(scale(point))),
				boundingBox: DOMRectReadOnly.fromRect({ x, y, width, height }),
			};
		});

		canvas.width = video.offsetWidth;
		canvas.height = video.offsetHeight;

		const ctx = canvas.getContext('2d');

		if (ctx === null) {
			throw new Error(
				'onFound handler should only be called when component is mounted. Thus tracking canvas 2D context is always defined.',
			);
		}

		tracker(adjustedCodes, ctx);
	}
}

export function Scanner(props: IScannerProps) {
	const {
		onScan,
		constraints,
		formats = ['qr_code'],
		paused = false,
		components,
		children,
		styles,
		classNames,
		allowMultiple,
		scanDelay,
		onError,
		sound,
	} = props;

	const videoRef = useRef<HTMLVideoElement>(null);
	const pauseFrameRef = useRef<HTMLCanvasElement>(null);
	const trackingLayerRef = useRef<HTMLCanvasElement>(null);

	const mergedConstraints = useMemo(
		() => ({ ...defaultConstraints, ...constraints }),
		[constraints],
	);
	const mergedComponents = useMemo(
		() => ({ ...defaultComponents, ...components }),
		[components],
	);

	const [isMounted, setIsMounted] = useState(false);
	const [isCameraActive, setIsCameraActive] = useState(true);
	const [constraintsCached, setConstraintsCached] = useState(mergedConstraints);

	const camera = useCamera();

	const cameraRef = useRef(camera);
	const onErrorRef = useRef(onError);
	const trackerRef = useRef(mergedComponents.tracker);

	useEffect(() => {
		cameraRef.current = camera;
	}, [camera]);

	useEffect(() => {
		onErrorRef.current = onError;
	}, [onError]);

	useEffect(() => {
		trackerRef.current = mergedComponents.tracker;
	}, [mergedComponents.tracker]);

	const onFoundCallback = useCallback((detectedCodes: IDetectedBarcode[]) => {
		onFound(
			detectedCodes,
			videoRef.current,
			trackingLayerRef.current,
			trackerRef.current,
		);
	}, []);

	const { startScanning, stopScanning } = useScanner({
		videoElementRef: videoRef,
		onScan: onScan,
		onFound: onFoundCallback,
		formats: formats,
		retryDelay: mergedComponents.tracker === undefined ? 500 : 10,
		scanDelay: scanDelay,
		allowMultiple: allowMultiple,
		sound: sound,
	});

	useEffect(() => {
		setIsMounted(true);

		return () => {
			setIsMounted(false);
		};
	}, []);

	useEffect(() => {
		if (isMounted) {
			stopScanning();
			startScanning();
		}
	}, [isMounted, startScanning, stopScanning]);

	useEffect(() => {
		if (!deepEqual(mergedConstraints, constraintsCached)) {
			const newConstraints = mergedConstraints;

			if (constraints?.deviceId) delete newConstraints.facingMode;

			setConstraintsCached(newConstraints);
		}
	}, [constraints, mergedConstraints, constraintsCached]);

	const cameraSettings = useMemo(() => {
		return {
			constraints: constraintsCached,
			shouldStream: isMounted && !paused,
		};
	}, [constraintsCached, isMounted, paused]);

	const onCameraChange = useCallback(async () => {
		const videoEl = videoRef.current;

		if (videoEl === undefined || videoEl === null) {
			throw new Error('Video should be defined when component is mounted.');
		}

		const canvasEl = pauseFrameRef.current;

		if (canvasEl === undefined || canvasEl === null) {
			throw new Error('Canvas should be defined when component is mounted.');
		}

		const ctx = canvasEl.getContext('2d');

		if (ctx === undefined || ctx === null) {
			throw new Error('Canvas should be defined when component is mounted.');
		}

		if (cameraSettings.shouldStream) {
			await cameraRef.current.stopCamera();

			setIsCameraActive(false);

			try {
				await cameraRef.current.startCamera(videoEl, cameraSettings);

				if (videoEl) {
					setIsCameraActive(true);
				} else {
					await cameraRef.current.stopCamera();
				}
			} catch (error) {
				onErrorRef.current?.(error);
				console.error('error', error);
			}
		} else {
			canvasEl.width = videoEl.videoWidth;
			canvasEl.height = videoEl.videoHeight;

			ctx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);

			await cameraRef.current.stopCamera();

			setIsCameraActive(false);
		}
	}, [cameraSettings]);

	useEffect(() => {
		(async () => {
			await onCameraChange();
		})();
	}, [onCameraChange]);

	const shouldScan = useMemo(() => {
		return cameraSettings.shouldStream && isCameraActive;
	}, [cameraSettings.shouldStream, isCameraActive]);

	useEffect(() => {
		if (shouldScan) {
			if (pauseFrameRef.current === undefined) {
				throw new Error(
					'shouldScan effect should only be triggered when component is mounted. Thus pause frame canvas is defined',
				);
			}

			clearCanvas(pauseFrameRef.current);

			if (trackingLayerRef.current === undefined) {
				throw new Error(
					'shouldScan effect should only be triggered when component is mounted. Thus tracking canvas is defined',
				);
			}

			clearCanvas(trackingLayerRef.current);

			const videoEl = videoRef.current;

			if (videoEl === undefined || videoEl === null) {
				throw new Error(
					'shouldScan effect should only be triggered when component is mounted. Thus video element is defined',
				);
			}

			startScanning();
		}
	}, [shouldScan, startScanning]);

	return (
		<div
			style={{ ...defaultStyles.container, ...styles?.container }}
			className={classNames?.container}
		>
			<video
				ref={videoRef}
				style={{
					...defaultStyles.video,
					...styles?.video,
					visibility: paused ? 'hidden' : 'visible',
				}}
				className={classNames?.video}
				autoPlay
				muted
				playsInline
			/>
			<canvas
				ref={pauseFrameRef}
				style={{
					display: paused ? 'block' : 'none',
					position: 'absolute',
					width: '100%',
					height: '100%',
				}}
			/>
			<canvas
				ref={trackingLayerRef}
				style={{ position: 'absolute', width: '100%', height: '100%' }}
			/>
			<div style={{ position: 'absolute', width: '100%', height: '100%' }}>
				{mergedComponents.finder && (
					<Finder
						scanning={isCameraActive}
						capabilities={camera.capabilities}
						onOff={mergedComponents.onOff}
						zoom={
							mergedComponents.zoom && camera.settings.zoom
								? {
										value: camera.settings.zoom,
										onChange: async (value) => {
											const newConstraints = {
												...constraintsCached,
												advanced: [{ zoom: value }],
											};

											await camera.updateConstraints(newConstraints);
										},
									}
								: undefined
						}
						torch={
							mergedComponents.torch
								? {
										status: camera.settings.torch ?? false,
										toggle: async (value) => {
											const newConstraints = {
												...constraintsCached,
												advanced: [{ torch: value }],
											};

											await camera.updateConstraints(newConstraints);
										},
									}
								: undefined
						}
						startScanning={async () => await onCameraChange()}
						stopScanning={async () => {
							await camera.stopCamera();

							clearCanvas(trackingLayerRef.current);
							setIsCameraActive(false);
						}}
					/>
				)}
				{children}
			</div>
		</div>
	);
}
