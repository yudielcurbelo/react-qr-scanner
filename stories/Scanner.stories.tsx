import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';

import { Scanner as ScannerComp, IScannerProps, outline, centerText, boundingBox, useDevices } from '../src';

import { defaultConstraints } from '../src/misc';

const styles = {
    container: {
        width: 400,
        margin: 'auto'
    },
    devices: {
        marginBottom: 10
    }
};

function Template(args: IScannerProps) {
    const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

    const devices = useDevices();

    return (
        <div style={styles.container}>
            <div style={styles.devices}>
                <select onChange={(e) => setDeviceId(e.target.value)}>
                    <option value={undefined}>Select a device</option>
                    {devices.map((device, index) => (
                        <option key={index} value={device.deviceId}>
                            {device.label}
                        </option>
                    ))}
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
                    'upc_e'
                ]}
                constraints={{
                    deviceId: deviceId
                }}
                onScan={(detectedCodes) => {
                    action('onScan')(detectedCodes);
                }}
                components={{
                    audio: true,
                    onOff: true,
                    torch: true,
                    tracker: centerText
                }}
                allowMultiple={true}
                scanDelay={2000}
            />
        </div>
    );
}

export const Scanner = Template.bind({});

// @ts-ignore
Scanner.args = {
    components: {
        audio: true,
        onOff: true
    },
    constraints: defaultConstraints,
    deviceId: ''
};

export default {
    title: 'Scanner'
};
