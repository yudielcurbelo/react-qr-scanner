import React from 'react';

import { useDevices } from '../src';

function Template() {
    const devices = useDevices();

    return <pre>{JSON.stringify(devices, null, 2)}</pre>;
}

export const Devices = Template.bind({});

export default {
    title: 'Devices'
};
