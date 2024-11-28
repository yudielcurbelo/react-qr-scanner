import React, { CSSProperties } from 'react';

interface ITorchOffProps {
    onClick: () => void;
    className?: string;
    style?: CSSProperties;
}

export default function TorchOff(props: ITorchOffProps) {
    const { onClick, className, style } = props;

    return (
        <svg onClick={onClick} width="30px" height="30px" viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            <path
                strokeWidth={0.2}
                stroke="yellow"
                fill="yellow"
                d="M14.516 15.158l.714.714-4.595 6.14-.75-.364L12.337 13H6.978L8.22 8.861l.803.803L8.322 12h3.036l1.793 1.792-1.475 5.16zm5.984 4.05L4.793 3.5l.707-.707 3.492 3.492L10.278 2h7.972l-5.025 7h7.149l-3.71 4.957 4.543 4.543zM12.707 10l3.243 3.243L18.376 10zM9.795 7.088l2.079 2.079L16.3 3h-5.278z"
            />
        </svg>
    );
}
