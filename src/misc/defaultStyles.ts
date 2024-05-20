import IScannerStyles from '../types/IScannerStyles';

export const defaultStyles: IScannerStyles = {
    container: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    video: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        overflow: 'hidden'
        // position: 'absolute',
        // objectFit: 'cover'
    },
    finderBorder: undefined
};
