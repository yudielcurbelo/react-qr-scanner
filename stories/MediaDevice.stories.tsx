import React from 'react';

import { useMediaDevices } from '../src';

function Template() {
    const state = useMediaDevices();

    return <pre>{JSON.stringify(state, null, 2)}</pre>;
}

export const ListDevices = Template.bind({});

export default {
    title: 'Media Device'
};
