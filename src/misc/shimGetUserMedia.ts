// @ts-ignore
import { shimGetUserMedia as chromeShim } from 'webrtc-adapter/dist/chrome/getusermedia.js';
// @ts-ignore
import { shimGetUserMedia as firefoxShim } from 'webrtc-adapter/dist/firefox/getusermedia.js';
// @ts-ignore
import { shimGetUserMedia as safariShim } from 'webrtc-adapter/dist/safari/safari_shim.js';
// @ts-ignore
import { detectBrowser } from 'webrtc-adapter/dist/utils.js';

import idempotent from '../utilities/idempotent';

export default idempotent(() => {
    const browserDetails = detectBrowser(window);

    switch (browserDetails.browser) {
        case 'chrome':
            chromeShim(window, browserDetails);
            break;
        case 'firefox':
            firefoxShim(window, browserDetails);
            break;
        case 'safari':
            safariShim(window, browserDetails);
            break;
        default:
            throw new Error('Unsupported browser');
    }
});
