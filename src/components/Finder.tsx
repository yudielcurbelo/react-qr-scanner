import type { CSSProperties } from 'react';

import OnOff from './OnOff';
import Torch from './Torch';
import Zoom from './Zoom';

const styles: Record<string, CSSProperties> = {
	fullContainer: {
		width: '100%',
		height: '100%',
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	innerContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	overlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	borderBox: {
		position: 'relative',
		width: '70%',
		aspectRatio: '1 / 1',
		border: '2px dashed rgba(239, 68, 68, 0.4)',
		borderRadius: '0.5rem',
	},
	cornerTopLeft: {
		position: 'absolute',
		width: '15%',
		height: '15%',
		border: '4px solid #ef4444',
		top: 0,
		left: 0,
		borderBottomColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopLeftRadius: '0.5rem',
	},
	cornerTopRight: {
		position: 'absolute',
		width: '15%',
		height: '15%',
		border: '4px solid #ef4444',
		top: 0,
		right: 0,
		borderBottomColor: 'transparent',
		borderLeftColor: 'transparent',
		borderTopRightRadius: '0.5rem',
	},
	cornerBottomLeft: {
		position: 'absolute',
		width: '15%',
		height: '15%',
		border: '4px solid #ef4444',
		bottom: 0,
		left: 0,
		borderTopColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomLeftRadius: '0.5rem',
	},
	cornerBottomRight: {
		position: 'absolute',
		width: '15%',
		height: '15%',
		border: '4px solid #ef4444',
		bottom: 0,
		right: 0,
		borderTopColor: 'transparent',
		borderLeftColor: 'transparent',
		borderBottomRightRadius: '0.5rem',
	},
};

interface IFinderProps {
	scanning: boolean;
	capabilities: MediaTrackCapabilities;
	onOff?: boolean;
	startScanning: (deviceId?: string | undefined) => void;
	stopScanning: () => void;
	torch?: {
		status: boolean;
		toggle: (value: boolean) => void;
	};
	zoom?: {
		value: number;
		onChange: (value: number) => void;
	};
}

export default function Finder(props: IFinderProps) {
	const {
		scanning,
		capabilities,
		onOff,
		torch,
		zoom,
		startScanning,
		stopScanning,
	} = props;

	return (
		<div style={styles.fullContainer}>
			<div style={styles.innerContainer}>
				<div style={styles.overlay}>
					<div style={styles.borderBox}>
						<div style={styles.cornerTopLeft}></div>
						<div style={styles.cornerTopRight}></div>
						<div style={styles.cornerBottomLeft}></div>
						<div style={styles.cornerBottomRight}></div>
					</div>
				</div>
				{onOff && (
					<OnOff
						scanning={scanning}
						startScanning={startScanning}
						stopScanning={stopScanning}
					/>
				)}
				{torch && capabilities.torch && (
					<Torch
						scanning={scanning}
						status={torch.status}
						torchToggle={torch.toggle}
					/>
				)}
				{zoom && capabilities.zoom && (
					<Zoom
						scanning={scanning}
						capabilities={capabilities.zoom}
						value={zoom.value}
						onZoom={zoom.onChange}
					/>
				)}
			</div>
		</div>
	);
}
