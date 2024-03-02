import IScannerStyles from '../types/IScannerStyles';

export const defaultStyles: IScannerStyles = {
    container: {
        width: '100%',
        paddingTop: '100%',
        overflow: 'hidden',
        position: 'relative'
    },
    video: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        overflow: 'hidden',
        position: 'absolute'
    },
    finderBorder: undefined
};
