import type { IScannerStyles } from '../types';

export const defaultStyles: IScannerStyles = {
	container: {
		width: '100%',
		height: '100%',
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		aspectRatio: '1/1',
	},
	video: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		overflow: 'hidden',
	},
};
