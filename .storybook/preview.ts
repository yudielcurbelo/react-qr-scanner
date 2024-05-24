import type { Preview } from '@storybook/react';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },
        options: {
            storySort: {
                method: '',
                order: ['Scanner', 'Devices'],
                locales: ''
            }
        }
    }
};

export default preview;
