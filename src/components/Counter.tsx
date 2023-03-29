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

interface CounterProps {
    scanCount: number;
}

const Counter = (props: CounterProps) => {
    const { scanCount } = props;

    return <div style={styles.count}>{scanCount}</div>;
};

export default Counter;
