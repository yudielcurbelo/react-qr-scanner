import React from 'react';

import { Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { QrScanner, IQrScannerProps } from '../src';
import { defaultConstraints } from '../src/misc/defaultConstraints';

const styles = {
    container: {
        width: 400,
        margin: 'auto'
    }
};

const Template: Story<IQrScannerProps> = (args) => {
    return (
        <div style={styles.container}>
            <QrScanner
                {...args}
                onResult={(result) => {
                    action('onResult')(result);
                }}
                onDecode={(result) => {
                    action('onDecode')(result);
                }}
                onError={(error) => {
                    action('onError')(error?.message);
                }}
            />
        </div>
    );
};

export const ScanCode = Template.bind({});

ScanCode.args = {
    scanDelay: 100,
    tracker: true,
    hideCount: false,
    constraints: defaultConstraints
};

export default {
    title: 'QR Scanner'
};
