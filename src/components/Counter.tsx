import React, { useState, useEffect } from 'react';

import { Result } from '@zxing/library';

interface ICounterProps {
    result?: Result;
}

export default function Counter(props: ICounterProps) {
    const { result } = props;

    const [count, setCount] = useState(0);

    useEffect(() => {
        if (result === undefined) {
            return;
        }

        setCount((prevCount) => prevCount + 1);
    }, [result]);

    return <div style={{ top: 0, right: 5, fontSize: 28, color: '#FFFFFF', position: 'absolute', zIndex: 1 }}>{count}</div>;
}
