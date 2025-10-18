import type { CSSProperties } from 'react';

interface IZoomInProps {
	onClick: () => void;
	className?: string;
	style?: CSSProperties;
	disabled?: boolean;
}

export default function ZoomInIcon(props: IZoomInProps) {
	const { onClick, className, disabled = false } = props;

	const style = {
		cursor: disabled ? 'default' : 'pointer',
		stroke: disabled ? 'grey' : 'yellow',
		fill: disabled ? 'grey' : 'yellow',
		...props.style,
	};

	return (
		<svg
			onClick={!disabled ? onClick : undefined}
			width="30px"
			height="30px"
			viewBox="0 0 24 24"
			className={className}
			style={style}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Zoom In</title>
			<path
				strokeWidth={0.3}
				d="M16.279,17.039c-1.396,1.209 -3.216,1.941 -5.206,1.941c-4.393,0 -7.96,-3.567 -7.96,-7.96c-0,-4.393 3.567,-7.96 7.96,-7.96c4.393,0 7.96,3.567 7.96,7.96c-0,2.044 -0.772,3.909 -2.04,5.319l0.165,0.165c1.194,1.194 2.388,2.388 3.583,3.582c0.455,0.456 -0.252,1.163 -0.707,0.708l-3.755,-3.755Zm1.754,-6.019c-0,-3.841 -3.119,-6.96 -6.96,-6.96c-3.842,0 -6.96,3.119 -6.96,6.96c-0,3.841 3.118,6.96 6.96,6.96c3.841,0 6.96,-3.119 6.96,-6.96Zm-7.46,0.5l-1.5,0c-0.645,0 -0.643,-1 -0,-1l1.5,0l-0,-1.5c-0,-0.645 1,-0.643 1,0l-0,1.5l1.5,0c0.645,0 0.643,1 -0,1l-1.5,0l-0,1.5c-0,0.645 -1,0.643 -1,0l-0,-1.5Z"
			/>
		</svg>
	);
}
