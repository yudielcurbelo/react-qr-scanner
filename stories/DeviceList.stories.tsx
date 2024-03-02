import React from 'react';

import { useDeviceList } from '../src/index';

function Template() {
    const state = useDeviceList();

    return <pre>{JSON.stringify(state, null, 2)}</pre>;
}

export const DeviceList = Template.bind({});

export default {
    title: 'Device List'
};
