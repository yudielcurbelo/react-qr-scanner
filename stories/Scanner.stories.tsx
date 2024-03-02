import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';

import { Scanner as ScannerComp, IScannerProps } from '../src';
import { defaultConstraints } from '../src/misc';
import Devices from '../src/components/Devices';

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
    const [deviceId, setDeviceId] = useState('');

    function handleOnChange(deviceId: string) {
        setDeviceId(deviceId);
    }

    return (
        <div style={styles.container}>
            <div style={styles.devices}>
                <Devices onChange={handleOnChange} />
            </div>
            <ScannerComp
                {...args}
                enabled={true}
                onResult={(text) => {
                    action('onResult')(text);
                }}
                onError={(error) => {
                    action('onError')(error?.message);
                }}
                components={{
                    count: true,
                    audio: true,
                    tracker: true,
                    torch: true,
                    onOff: true
                }}
                options={{
                    deviceId: deviceId,
                    delayBetweenScanAttempts: 100,
                    delayBetweenScanSuccess: 100
                }}
            />
        </div>
    );
}

export const Scanner = Template.bind({});

// @ts-ignore
Scanner.args = {
    tracker: true,
    count: false,
    constraints: defaultConstraints,
    deviceId: ''
};

export default {
    title: 'Scanner'
};
