import React, { FC, useState, useEffect } from 'react';

const styles: any = {
    count: {
        bottom: 0,
        right: 5,
        fontSize: 30,
        color: '#fff',
        position: 'absolute',
        zIndex: 1
    }
};

interface FinderProps {
    scanCount: number;
    hideCount: boolean;
}

export const Finder: FC<FinderProps> = (props) => {
    const { scanCount } = props;

    const [color, setColor] = useState('rgba(255, 0, 0, 0.5)');

    useEffect(() => {
        if (scanCount === 0) return;

        setColor('rgba(0, 255, 0, 0.5)');

        let timer = setTimeout(() => {
            setColor('rgba(255, 0, 0, 0.5)');
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [scanCount]);

    return (
        <>
            {}
            <span style={styles.count}>
                {scanCount}
            </span>
            <svg
                width='50px'
                viewBox='0 0 100 100'
                style={{
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    boxSizing: 'border-box',
                    border: '80px solid rgba(0, 0, 0, 0.1)',
                    position: 'absolute',
                    width: '100%',
                    height: '100%'
                }}
            >
                <path
                    fill='none'
                    d='M23,0 L0,0 L0,23'
                    stroke={color}
                    strokeWidth='5'
                />
                <path
                    fill='none'
                    d='M0,77 L0,100 L23,100'
                    stroke={color}
                    strokeWidth='5'
                />
                <path
                    fill='none'
                    d='M77,100 L100,100 L100,77'
                    stroke={color}
                    strokeWidth='5'
                />
                <path
                    fill='none'
                    d='M100,23 L100,0 77,0'
                    stroke={color}
                    strokeWidth='5'
                />
            </svg>
        </>
    );
};