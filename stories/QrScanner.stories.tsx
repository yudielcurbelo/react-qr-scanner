import React from 'react';

import { Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import QrScanner from '../src/components/QrScanner';
import { IQrScannerProps } from '../src';

const styles = {
    container: {
        width: '400px',
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
    constraints: {facingMode: 'environment'},
};

export default {
    title: 'QR Scanner',
    component: QrScanner
};