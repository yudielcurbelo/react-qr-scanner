import { useMemo, useState } from 'react';

import { action } from 'storybook/actions';

import {
	boundingBox,
	centerText,
	type IScannerProps,
	outline,
	Scanner as ScannerComp,
	useDevices,
} from '../src';

const styles = {
	container: {
		width: '80%',
		maxWidth: 500,
		margin: 'auto',
	},
	controls: {
		marginBottom: 8,
	},
};

function Template(args: IScannerProps) {
	const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
	const [tracker, setTracker] = useState<string | undefined>('centerText');

	const [pause, setPause] = useState(false);

	const devices = useDevices();

	const componentsConfig = useMemo(() => {
		let trackerFunction;

		switch (tracker) {
			case 'outline':
				trackerFunction = outline;
				break;
			case 'boundingBox':
				trackerFunction = boundingBox;
				break;
			case 'centerText':
				trackerFunction = centerText;
				break;
			default:
				trackerFunction = undefined;
		}

		return {
			onOff: true,
			torch: true,
			zoom: true,
			finder: true,
			tracker: trackerFunction,
		};
	}, [tracker]);

	return (
		<div style={styles.container}>
			<button
				type="button"
				style={{ marginBottom: 5 }}
				onClick={() => setPause((val) => !val)}
			>
				{pause ? 'Pause Off' : 'Pause On'}
			</button>
			<div style={styles.controls}>
				<select onChange={(e) => setDeviceId(e.target.value)}>
					<option value={undefined}>Select a device</option>
					{devices.map((device, index) => (
						<option key={index} value={device.deviceId}>
							{device.label}
						</option>
					))}
				</select>
				<select
					style={{ marginLeft: 5 }}
					value={tracker}
					onChange={(e) => setTracker(e.target.value)}
				>
					<option value="centerText">Center Text</option>
					<option value="outline">Outline</option>
					<option value="boundingBox">Bounding Box</option>
					<option value="">No Tracker</option>
				</select>
			</div>
			<ScannerComp
				{...args}
				formats={[
					'qr_code',
					'micro_qr_code',
					'rm_qr_code',
					'maxi_code',
					'pdf417',
					'aztec',
					'data_matrix',
					'matrix_codes',
					'dx_film_edge',
					'databar',
					'databar_expanded',
					'codabar',
					'code_39',
					'code_93',
					'code_128',
					'ean_8',
					'ean_13',
					'itf',
					'linear_codes',
					'upc_a',
					'upc_e',
				]}
				constraints={{
					deviceId: deviceId,
				}}
				onScan={(detectedCodes) => {
					action('onScan')(detectedCodes);
				}}
				onError={(error) => {
					console.log(`onError: ${error}'`);
				}}
				components={componentsConfig}
				sound={true}
				allowMultiple={true}
				scanDelay={2000}
				paused={pause}
			/>
		</div>
	);
}

export const Scanner = Template.bind({});

// @ts-expect-error
Scanner.args = {};

export default {
	title: 'Scanner',
};
