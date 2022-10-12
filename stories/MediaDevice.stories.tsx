import React from 'react';

import { Story } from '@storybook/react';

import { useMediaDevices } from '../src';

const Template: Story = (args) => {
    const state = useMediaDevices();

    return <pre>{JSON.stringify(state, null, 2)}</pre>;
};

export const ListDevices = Template.bind({});

ListDevices.args = {};

export default {
    title: 'Media Device'
};
