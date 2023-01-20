import React, { CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
    count: {
        bottom: 0,
        right: 5,
        fontSize: 30,
        color: '#fff',
        position: 'absolute',
        zIndex: 1
    }
};

interface ICounterProps {
    scanCount: number;
}

const Counter = (props: ICounterProps) => {
    const { scanCount } = props;

    return <div style={styles.count}>{scanCount}</div>;
};

export default Counter;
