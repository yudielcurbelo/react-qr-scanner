import { RefCallback, RefObject } from 'react';

export function mergeRefs<T>(...refs: Array<RefObject<T> | RefCallback<T> | null | undefined>): RefCallback<T> {
    return (value) => {
        for (const ref of refs) {
            if (ref == null) {
                continue;
            }

            if (typeof ref === 'function') {
                ref(value);
                continue;
            }

            (ref as RefObject<T | null>).current = value;
        }
    };
}
